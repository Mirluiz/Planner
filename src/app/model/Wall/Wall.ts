import {
  Engine,
  Geometry,
  Storage,
  Entity,
  Helpers,
  Object3D,
  Object3DProps,
  Object3DSchema,
} from "../../system";
import * as THREE from "three";
import { Vector3 } from "three";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";

class Wall implements Object3D, Geometry.Line {
  isWall = true;

  mesh: Engine.Mesh | null = null;

  uuid;
  dimension;
  rotation;
  position;

  start;
  end;

  startAngle: number = 0;
  endAngle: number = 0;

  connections: {
    start: Object | null;
    end: Object | null;
  } = { start: null, end: null };

  constructor(
    props: {
      start: Geometry.Vector3;
      end: Geometry.Vector3;
    } & Object3DProps
  ) {
    this.start = new Vector3(props.start.x, props.start.y, props.start.z);
    this.end = new Vector3(props.end.x, props.end.y, props.end.z);

    this.uuid = props.uuid ?? Helpers.uuid();
    this.dimension = { width: 1, height: 1, depth: 1 };
    this.rotation = props.rotation ?? { w: 0, x: 0, y: 0, z: 0 };
    this.position = props.position ?? { x: 0, y: 0, z: 0 };

    this.mesh = new Engine.Mesh();
  }

  destroy() {
    this.mesh?.destroy();
  }

  update() {
    if (!this.mesh) return;
    let ln = this.start.distanceTo(this.end);

    const threeMesh = this.mesh.returnTHREE();

    let geometry = this.getGeometry();

    if (!threeMesh) return;

    let textMesh = threeMesh.children[0];

    if (textMesh instanceof THREE.Mesh) {
      textMesh.geometry.dispose();
      textMesh.material.dispose();
      textMesh.removeFromParent();
    }

    threeMesh.geometry.dispose(); // Dispose of the old geometry to free up memory
    threeMesh.geometry = geometry;
    // threeMesh.material = Storage.materials[this.uuid]?.clone();
    threeMesh.material = new THREE.MeshStandardMaterial({ color: 0xefd0b5 });

    // if (threeMesh.material) {
    //   threeMesh.material.map.wrapS = threeMesh.material.map.wrapT =
    //     THREE.RepeatWrapping;
    //   threeMesh.material.map.repeat.set(ln * 0.365, 1);
    // }

    threeMesh.geometry.needsUpdate = true;

    const midPoint = new THREE.Vector3();
    midPoint.addVectors(this.start, this.end).multiplyScalar(0.5);

    threeMesh.position.copy(midPoint);

    threeMesh.lookAt(this.end);
    threeMesh.rotateY(Math.PI / 2);

    let txtMesh = this.getText();
    if (txtMesh) {
      threeMesh.add(txtMesh);
    }

    // let angleMesh = this.getAngle();
    // if (angleMesh) {
    //   threeMesh.add(angleMesh);
    // }

    this.mesh?.render(threeMesh);

    threeMesh.updateMatrix();
  }

  render() {
    this.mesh?.destroy();

    let geometry = this.getGeometry();

    let ln = this.start.distanceTo(this.end);

    // if (!Storage.materials[this.uuid]) {
    //   const texture = new THREE.TextureLoader().load(
    //     "/assets/wall.jpg",
    //     (newText) => {
    //       newText.wrapS = newText.wrapT = THREE.RepeatWrapping;
    //       newText.repeat.set(ln * 0.365, 1);
    //
    //       Storage.materials[this.uuid] = new THREE.MeshBasicMaterial({
    //         map: newText,
    //       });
    //     }
    //   );
    // }

    // const material = Storage.materials[this.uuid];
    const material = new THREE.MeshStandardMaterial({ color: 0xefd0b5 });
    const mesh = new THREE.Mesh(geometry, material);

    const midPoint = new THREE.Vector3();
    midPoint.addVectors(this.start, this.end).multiplyScalar(0.5);

    mesh.position.copy(midPoint);

    mesh.lookAt(this.end);
    mesh.rotateY(Math.PI / 2);

    mesh.name = "Wall";
    mesh.userData.object = this;

    let textMesh = this.getText();

    if (textMesh) {
      mesh.add(textMesh);
    }

    // let angleMesh = this.getAngle();
    // if (angleMesh) {
    //   mesh.add(angleMesh);
    // }

    this.mesh?.render(mesh);

    return this.mesh;
  }

  private getGeometry() {
    let depth = 0.2;
    let ln = this.start.distanceTo(this.end);
    let h = 1.6;

    let endAngle = (this.getEndAngle() * Math.PI) / 180; // is angle
    let endCrop = (depth / 2) * Math.tan(endAngle);
    let endSideEdgeLn =
      Math.sqrt(endCrop * endCrop + (depth / 2) * (depth / 2)) * 2;

    let right = [
      new THREE.Vector3(0, h, endSideEdgeLn / 2)
        .applyAxisAngle(new THREE.Vector3(0, 1, 0), endAngle)
        .add(new THREE.Vector3(ln / 2, 0, 0)),
      new THREE.Vector3(0, h, -endSideEdgeLn / 2)
        .applyAxisAngle(new THREE.Vector3(0, 1, 0), endAngle)
        .add(new THREE.Vector3(ln / 2, 0, 0)),
      new THREE.Vector3(0, 0, endSideEdgeLn / 2)
        .applyAxisAngle(new THREE.Vector3(0, 1, 0), endAngle)
        .add(new THREE.Vector3(ln / 2, 0, 0)),
      new THREE.Vector3(0, 0, -endSideEdgeLn / 2)
        .applyAxisAngle(new THREE.Vector3(0, 1, 0), endAngle)
        .add(new THREE.Vector3(ln / 2, 0, 0)),
    ];

    let startAngle = (this.getStartAngle() * Math.PI) / 180; // is angle
    let startCrop = (depth / 2) * Math.tan(startAngle);

    let startSideEdgeLn =
      Math.sqrt(startCrop * startCrop + (depth / 2) * (depth / 2)) * 2;

    let left = [
      new THREE.Vector3(0, h, -startSideEdgeLn / 2)
        .applyAxisAngle(new THREE.Vector3(0, 1, 0), startAngle)
        .add(new THREE.Vector3(-ln / 2, 0, 0)),
      new THREE.Vector3(0, h, startSideEdgeLn / 2)
        .applyAxisAngle(new THREE.Vector3(0, 1, 0), startAngle)
        .add(new THREE.Vector3(-ln / 2, 0, 0)),
      new THREE.Vector3(0, 0, -startSideEdgeLn / 2)
        .applyAxisAngle(new THREE.Vector3(0, 1, 0), startAngle)
        .add(new THREE.Vector3(-ln / 2, 0, 0)),
      new THREE.Vector3(0, 0, startSideEdgeLn / 2)
        .applyAxisAngle(new THREE.Vector3(0, 1, 0), startAngle)
        .add(new THREE.Vector3(-ln / 2, 0, 0)),
    ];

    let front = [
      new THREE.Vector3(0, h, depth / 2).add(
        new THREE.Vector3(-ln / 2 + startCrop, 0, 0)
      ),
      new THREE.Vector3(0, h, depth / 2).add(
        new THREE.Vector3(ln / 2 + endCrop, 0, 0)
      ),
      new THREE.Vector3(0, 0, depth / 2).add(
        new THREE.Vector3(-ln / 2 + startCrop, 0, 0)
      ),
      new THREE.Vector3(0, 0, depth / 2).add(
        new THREE.Vector3(ln / 2 + endCrop, 0, 0)
      ),
    ];

    let back = [
      new THREE.Vector3(0, h, -depth / 2).add(
        new THREE.Vector3(ln / 2 - endCrop, 0, 0)
      ),
      new THREE.Vector3(0, h, -depth / 2).add(
        new THREE.Vector3(-ln / 2 - startCrop, 0, 0)
      ),
      new THREE.Vector3(0, 0, -depth / 2).add(
        new THREE.Vector3(ln / 2 - endCrop, 0, 0)
      ),
      new THREE.Vector3(0, 0, -depth / 2).add(
        new THREE.Vector3(-ln / 2 - startCrop, 0, 0)
      ),
    ];

    let up = [
      new THREE.Vector3(0, h, depth / 2).add(
        new THREE.Vector3(ln / 2 - endCrop, 0, 0)
      ),
      new THREE.Vector3(0, h, depth / 2).add(
        new THREE.Vector3(-ln / 2 - startCrop, 0, 0)
      ),
      new THREE.Vector3(0, h, -depth / 2).add(
        new THREE.Vector3(ln / 2 - endCrop, 0, 0)
      ),
      new THREE.Vector3(0, h, -depth / 2).add(
        new THREE.Vector3(-ln / 2 - startCrop, 0, 0)
      ),
    ];

    let bottom = [
      new THREE.Vector3(0, 0, depth / 2).add(
        new THREE.Vector3(-ln / 2 - startCrop, 0, 0)
      ),
      new THREE.Vector3(0, 0, depth / 2).add(
        new THREE.Vector3(ln / 2 - endCrop, 0, 0)
      ),

      new THREE.Vector3(0, 0, -depth / 2).add(
        new THREE.Vector3(-ln / 2 - startCrop, 0, 0)
      ),
      new THREE.Vector3(0, 0, -depth / 2).add(
        new THREE.Vector3(ln / 2 - endCrop, 0, 0)
      ),
    ];

    // const vertices = [...front, ...up, ...right, ...bottom, ...back, ...left];
    const vertices = [...front, ...right, ...back, ...left];

    return new THREE.BoxGeometry().setFromPoints(vertices);
  }

  private getStartAngle() {
    return this.startAngle;
  }

  private getEndAngle() {
    return this.endAngle;
  }

  private angle(start: Vector3, end: Vector3) {
    const dx = end.x - start.x;
    const dy = end.z - start.z;

    let theta = Math.atan2(dy, dx);
    theta *= 180 / Math.PI;

    return theta;
  }

  private getText() {
    if (!Storage.debug) return null;

    let textMesh: null | THREE.Mesh = null;

    if (Storage.font) {
      let polarAngle = this.angle(this.start, this.end);

      const scale = 800;
      const textGeometry = new TextGeometry(this.uuid.slice(0, 3), {
        font: Storage.font,
        size: 120 / scale,
        height: 1 / scale,
        bevelThickness: 1 / scale,
      });

      const material = new THREE.MeshBasicMaterial({ color: 0x00 });
      textMesh = new THREE.Mesh(textGeometry, material);

      if (Math.abs(polarAngle) < 90) {
        textMesh.rotateOnAxis(new Vector3(0, 1, 0), -Math.PI);
      }

      textMesh.rotateOnAxis(new Vector3(1, 0, 0), -Math.PI / 2);
      textMesh.position.copy(new Vector3(0, 1.7, 0));
    }

    return textMesh;
  }

  private getAngle() {
    let ln = this.start.distanceTo(this.end);

    const geometry = new THREE.BoxGeometry(1, 2, 0.05);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);

    // console.log(
    //   "(this.endAngle * Math.PI) / 180",
    //   this.endAngle,
    //   (this.endAngle * Math.PI) / 180
    // );
    cube.rotateY((this.endAngle * Math.PI) / 180);

    cube.position.set(-ln / 2, 2, 0);
    // cube.position.set(0, 2, 0);

    return cube;
  }

  static fromJson(schema: Object3DSchema) {
    if (!schema.start || !schema.end) return;

    const wall = new Wall({
      start: new Vector3(schema.start.x, schema.start.y, schema.start.z),
      end: new Vector3(schema.end.x, schema.end.y, schema.end.z),
    });

    wall.position = schema.position;
    wall.rotation = schema.rotation;
    wall.uuid = schema.uuid;
    wall.dimension = schema.dimension;

    return wall;
  }

  toJson() {
    return {
      uuid: this.uuid,
      dimension: this.dimension,
      rotation: this.rotation,
      position: this.position,

      start: { x: this.start.x, y: this.start.y, z: this.start.z },
      end: { x: this.end.x, y: this.end.y, z: this.end.z },
      type: Entity.WALL,
    };
  }
}

export { Wall };

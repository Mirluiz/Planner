import {
  Entity,
  Object3D,
  Object3DProps,
  Object3DSchema,
  Engine,
  Helpers,
  Storage,
} from "../system";
import * as THREE from "three";
import { Corner } from "./Wall/Corner";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";
import { Vector3, ShapeUtils } from "three";

class Room implements Object3D {
  mesh: Engine.Mesh | null = null;

  corners: Array<Corner> = [];

  uuid;
  dimension;
  rotation;
  position;

  constructor(props: Object3DProps) {
    this.uuid = props.uuid ?? Helpers.uuid();
    this.dimension = props.dimension ?? { width: 0.1, depth: 1, height: 1 };
    this.rotation = props.rotation ?? { w: 0, x: 0, y: 0, z: 0 };
    this.position = props.position ?? { x: 0, y: 0, z: 0 };

    this.mesh = new Engine.Mesh();
  }

  update() {
    if (!this.mesh) return;
    const threeMesh = this.mesh.returnTHREE();

    const geometry = this.getGeometry();
    const material = new THREE.MeshPhongMaterial({ color: 0xff0000 });

    if (!threeMesh) return;

    let textMesh = threeMesh.children[0];
    if (textMesh instanceof THREE.Mesh) {
      textMesh.geometry.dispose();
      textMesh.material.dispose();
      textMesh.removeFromParent();
    }

    threeMesh.geometry.dispose();
    threeMesh.geometry = geometry;
    threeMesh.material = material;

    let txtMesh = this.getText();
    if (txtMesh) {
      threeMesh.add(txtMesh);
    }

    this.mesh?.render(threeMesh);

    threeMesh.updateMatrix();
  }

  destroy() {
    this.mesh?.destroy();
  }

  render() {
    this.mesh?.destroy();

    let geometry = this.getGeometry();

    const material = new THREE.MeshPhongMaterial({ color: 0x009dc4 });
    const mesh = new THREE.Mesh(geometry, material);

    material.transparent = true;
    material.opacity = 0.5;

    console.log(
      "==",
      Math.abs(
        ShapeUtils.area(
          this.corners.map(
            (corner) => new THREE.Vector2(corner.position.x, corner.position.z)
          )
        )
      )
    );

    let txtMesh = this.getText();
    if (txtMesh) {
      mesh.add(txtMesh);
    }

    this.mesh?.render(mesh);

    return this.mesh;
  }

  private getGeometry() {
    let firstCorner = this.corners[0];
    let shape = new THREE.Shape();

    shape.moveTo(firstCorner.position.x, firstCorner.position.z);

    this.corners.map((corner, index, array) => {
      if (index === 0) return;

      shape.lineTo(corner.position.x, corner.position.z);
    });

    const extrudeSettings = {};

    let extrude = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    extrude.rotateX(Math.PI / 2);

    return extrude;
  }

  private getText(info?: string) {
    if (!Storage.debug) return null;

    let textMesh: null | THREE.Mesh = null;

    if (Storage.font) {
      const scale = 800;
      const textGeometry = new TextGeometry(this.uuid.slice(0, 3) + info, {
        font: Storage.font,
        size: 120 / scale,
        height: 1 / scale,
        bevelThickness: 1 / scale,
      });

      let center = new Vector3();

      this.corners.map((corner) => {
        center.add(
          new Vector3(corner.position.x, corner.position.y, corner.position.z)
        );
      });
      center.setX(center.x / this.corners.length);
      center.setY(center.y / this.corners.length);
      center.setZ(center.z / this.corners.length);

      const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
      textMesh = new THREE.Mesh(textGeometry, material);

      console.log("center", center);
      textMesh.rotateOnAxis(new Vector3(1, 0, 0), -Math.PI / 2);
      textMesh.position.copy(new Vector3(0, 1, 0));
    }

    return textMesh;
  }

  toJson() {
    return {
      uuid: this.uuid,
      dimension: this.dimension,
      rotation: this.rotation,
      position: this.position,
      type: Entity.FITTING,
    };
  }

  static fromJson(schema: Omit<Object3DSchema, "type">) {
    return new Room({ ...schema });
  }
}

export { Room };

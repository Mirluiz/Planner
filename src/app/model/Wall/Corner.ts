import {
  Helpers,
  Engine,
  Object3D,
  Object3DProps,
  Object3DSchema,
  Entity,
  Storage,
} from "../../system";
import * as THREE from "three";
import { Wall } from "./Wall";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";
import { Vector3 } from "three";

class Corner implements Object3D {
  mesh: Engine.Mesh | null = null;
  walls: Array<Wall> = [];

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

    if (!threeMesh) return;

    const geometry = new THREE.CylinderGeometry(0.3, 0.3, 1, 32);

    threeMesh.geometry.dispose(); // Dispose of the old geometry to free up memory
    threeMesh.geometry = geometry;

    let textMesh = threeMesh.children[0];
    if (textMesh instanceof THREE.Mesh) {
      textMesh.geometry.dispose();
      textMesh.material.dispose();
      textMesh.removeFromParent();
    }

    let txtMesh = this.getText();
    if (txtMesh) {
      threeMesh.add(txtMesh);
    }

    threeMesh.position.set(this.position.x, this.position.y, this.position.z);

    threeMesh.updateMatrix();
  }

  destroy() {
    this.mesh?.destroy();
  }

  render() {
    this.mesh?.destroy();

    const geometry = new THREE.CylinderGeometry(
      this.dimension.width + 0.3,
      this.dimension.width,
      this.dimension.height,
      32
    );
    const material = new THREE.MeshBasicMaterial({ color: 0x00 });
    const mesh = new THREE.Mesh(geometry, material);

    mesh.position.set(this.position.x, this.position.y, this.position.z);

    mesh.userData.object = this;
    mesh.name = "Fitting";

    let txtMesh = this.getText();
    if (txtMesh) {
      mesh.add(txtMesh);
    }

    this.mesh?.render(mesh);

    return this.mesh;
  }

  private getText() {
    let textMesh: null | THREE.Mesh = null;

    if (Storage.font) {
      const scale = 800;
      const textGeometry = new TextGeometry(this.uuid.slice(0, 3), {
        font: Storage.font,
        size: 120 / scale,
        height: 1 / scale,
        bevelThickness: 1 / scale,
      });

      const material = new THREE.MeshBasicMaterial({ color: 0x00 });
      textMesh = new THREE.Mesh(textGeometry, material);

      textMesh.rotateOnAxis(new Vector3(1, 0, 0), -Math.PI / 2);
      textMesh.position.copy(new Vector3(0.5, 2, 0));
    }

    return textMesh;
  }

  static fromJson(schema: Omit<Object3DSchema, "type">) {
    return new Corner({ ...schema });
  }

  toJson() {
    return {
      uuid: this.uuid,
      dimension: this.dimension,
      rotation: this.rotation,
      position: this.position,
      type: Entity.CORNER,
    };
  }
}

export { Corner };

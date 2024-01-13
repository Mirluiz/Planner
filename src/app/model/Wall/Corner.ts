import {
  Helpers,
  Engine,
  Object3D,
  Object3DProps,
  Object3DSchema,
  Entity,
} from "../../system";
import * as THREE from "three";
import { Wall } from "./Wall";

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

    const geometry = new THREE.CylinderGeometry(0.1, 0.1, 1, 32);

    threeMesh.geometry.dispose(); // Dispose of the old geometry to free up memory
    threeMesh.geometry = geometry;

    threeMesh.position.set(this.position.x, this.position.y, this.position.z);

    threeMesh.updateMatrix();
  }

  destroy() {
    this.mesh?.destroy();
  }

  render() {
    this.mesh?.destroy();

    const geometry = new THREE.CylinderGeometry(
      this.dimension.width,
      this.dimension.width,
      this.dimension.height,
      32
    );
    const material = new THREE.MeshBasicMaterial({ color: 0x00 });
    const mesh = new THREE.Mesh(geometry, material);

    mesh.position.set(this.position.x, this.position.y, this.position.z);

    mesh.userData.object = this;
    mesh.name = "Fitting";

    this.mesh?.render(mesh);

    return this.mesh;
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

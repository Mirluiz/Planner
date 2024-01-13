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

    threeMesh.geometry.dispose();
    threeMesh.geometry = geometry;
    threeMesh.material = material;

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

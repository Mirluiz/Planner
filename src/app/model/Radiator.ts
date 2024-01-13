import { Entity, Object3D, Object3DProps, Engine, Helpers } from "../system";
import * as THREE from "three";

class Radiator implements Object3D {
  mesh: Engine.Mesh | null = null;

  uuid;
  dimension;
  rotation;
  position;

  constructor(props: Object3DProps) {
    this.uuid = Helpers.uuid();
    this.dimension = props.dimension ?? { width: 1, depth: 1, height: 1 };
    this.rotation = props.rotation ?? { w: 0, x: 0, y: 0, z: 0 };
    this.position = props.position ?? { x: 0, y: 0, z: 0 };
  }

  update() {}

  destroy() {
    this.mesh?.destroy();
  }

  render() {
    return this.mesh;
  }

  toJson() {
    return {
      uuid: this.uuid,
      dimension: this.dimension,
      rotation: this.rotation,
      position: this.position,
      type: Entity.RADIATOR,
    };
  }
}

export { Radiator };
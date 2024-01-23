import {
  Object3D,
  Object3DProps,
  Object3DSchema,
  Geometry,
  Helpers,
  Engine,
  Entity,
} from "../system";
import * as THREE from "three";

class Fitting implements Object3D {
  uuid;
  dimension;
  rotation;
  position;

  constructor(props: Object3DProps) {
    this.uuid = props.uuid ?? Helpers.uuid();
    this.dimension = props.dimension ?? { width: 0.1, depth: 1, height: 1 };
    this.rotation = props.rotation ?? { w: 0, x: 0, y: 0, z: 0 };
    this.position = props.position ?? { x: 0, y: 0, z: 0 };
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
    return new Fitting({ ...schema });
  }
}

export { Fitting };

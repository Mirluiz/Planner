import {
  Helpers,
  Entity,
} from "../../../system";
import * as THREE from "three";
import { Basic3D, Object3DProps, Object3DSchema } from "../Object3D";

class Fitting extends Basic3D {

  constructor(props: Object3DProps) {
    super(props);

    this.type = Entity.FITTING;
  }

  onUpdate() {
    console.log("=");
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

  clone() {
    return new Fitting(this.toJson());
  }
}

export { Fitting };

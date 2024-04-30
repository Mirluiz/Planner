import { Entity, Engine, Helpers } from "../../../system";
import { Basic3D, Object3D, Object3DProps} from "../Object3D";

class Radiator extends Basic3D {
  constructor(props: Object3DProps) {
    super(props)
    this.type = Entity.RADIATOR;
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
      type: Entity.RADIATOR,
    };
  }

  clone() {
    return new Radiator(this.toJson());
  }
}

export { Radiator };

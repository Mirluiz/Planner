import {
  Helpers,
  Entity,
} from "../../../system";
import { Basic3D, Object3DProps, Object3DSchema } from "../Object3D";
import { Wall } from "./Wall";

class Window extends Basic3D {

  attachedWall: {
    wall: Wall;
    centerOffset: number;
  } | null = null;
 
 

  constructor(props: Object3DProps) {
    super(props)

    this.type = Entity.ROOM;
  }

   

  toJson() {
    return {
      uuid: this.uuid,
      dimension: { ...this.dimension },
      rotation: { ...this.rotation },
      position: { ...this.position },
      type: Entity.FITTING,
    };
  }

  static fromJson(schema: Omit<Object3DSchema, "type">) {
    return new Window({ ...schema });
  }

  clone() {
    let jsonV = this.toJson();
    jsonV.uuid = Helpers.uuid();
    return new Window(jsonV);
  }
}

export { Window };

import {
  Helpers,
  Entity,
} from "../../../system";
import { Vector3 } from "three";
import { Object3DProps, Basic3D } from "../Object3D";
import { Wall } from "./Wall";

export type DoorProps = Object3DProps & { face: Vector3 };

class Door extends Basic3D {
  face: Vector3;

  attachedWall: {
    wall: Wall;
    centerOffset: number;
    faceClockwise: 1 | -1;
  } | null = null;

  constructor(props: DoorProps) {
    super(props);

    this.face = props.face;
    this.type = Entity.DOOR;
  }


  toJson() {
    let basicJson = super.toJson();

    return {
      ...basicJson,
      face: this.face.clone(),
      type: Entity.FITTING,
    };
  }

  static fromJson(schema: DoorProps) {
    return new Door({ ...schema });
  }

  clone() {
    let jsonV = this.toJson();
    jsonV.uuid = Helpers.uuid();
    return new Door(jsonV);
  }

  static createDefault() {
    return new Door({
      face: new Vector3(0, 0, 1)
    });
  }
}

export { Door };

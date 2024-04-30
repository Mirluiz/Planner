import {
  Entity,
  Vertex,
} from "../../../system";
import { Basic3D, Object3DProps, Object3DSchema } from "../Object3D";
import { Corner } from "./Corner";

class Room extends Basic3D {
  corners: Array<Corner> = [];
  triangulation: Array<Vertex> = [];
  

  constructor(props:  Object3DProps) {
    super(props);
    this.type = Entity.ROOM;
  }
 
  getArea() {
    let area = 0;

    let _i = 0;
    const n = this.triangulation.length;
    while (_i < this.triangulation.length) {
      const v0 = this.triangulation[_i];
      const v1 = this.triangulation[(_i + 1) % n];
      const v2 = this.triangulation[(_i + 2) % n];

      area +=
        Math.abs(
          v0.position.x * (v1.position.z - v2.position.z) +
            v1.position.x * (v2.position.z - v0.position.z) +
            v2.position.x * (v0.position.z - v1.position.z),
        ) / 2;

      _i += 3;
    }

    return area;
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

  clone() {
    return new Room(this.toJson());
  }

  static createDefault() {
    return new Room({});
  }
}

export { Room };

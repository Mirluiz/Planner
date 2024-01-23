import {
  Entity,
  Object3D,
  Object3DProps,
  Object3DSchema,
  Engine,
  Helpers,
  Storage,
  Math2D,
} from "../system";
import * as THREE from "three";
import { Corner } from "./Wall/Corner";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";
import { Vector3, ShapeUtils } from "three";
import { Polygon } from "../system/utils/Polygon";
import { Color, ColorManager } from "../system/utils/Color";
import { Vertex } from "../controller";

class Room implements Object3D {
  hovered: boolean = false;

  corners: Array<Corner> = [];
  triangulation: Array<Vertex> = [];

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
    return new Room({ ...schema });
  }
}

export { Room };

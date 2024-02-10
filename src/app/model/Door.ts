import {
  Object3D,
  Object3DProps,
  Object3DSchema,
  Helpers,
  Entity,
  Observer,
} from "../system";
import { Wall } from "./Wall/Wall";
import { Vector3 } from "three";

class Door implements Object3D {
  private observers: Observer[] = [];
  face: Vector3;

  attachedWall: {
    wall: Wall;
    centerOffset: number;
  } | null = null;

  uuid;
  dimension;
  rotation;
  position;

  type = Entity.DOOR;

  constructor(props?: Object3DProps & { face: Vector3 }) {
    if (!props) {
      this.uuid = Helpers.uuid();
      this.dimension = { width: 0.1, depth: 1, height: 1 };
      this.rotation = { w: 0, x: 0, y: 0, z: 0 };
      this.position = { x: 0, y: 0, z: 0 };
      this.face = new Vector3();
    } else {
      this.face = props.face ?? new Vector3();
      this.uuid = props.uuid ?? Helpers.uuid();
      this.dimension = props.dimension ?? { width: 0.1, depth: 1, height: 1 };
      this.rotation = props.rotation ?? { w: 0, x: 0, y: 0, z: 0 };
      this.position = props.position ?? { x: 0, y: 0, z: 0 };
    }
  }

  addObserver(observer: Observer) {
    this.observers.push(observer);
  }

  notifyObservers() {
    for (const observer of this.observers) {
      observer.trigger();
    }
  }

  destroy() {
    for (const observer of this.observers) {
      observer.trigger();
    }
  }

  toJson() {
    return {
      uuid: this.uuid,
      dimension: { ...this.dimension },
      rotation: { ...this.rotation },
      position: { ...this.position },
      face: this.face.clone(),
      type: Entity.FITTING,
    };
  }

  static fromJson(
    schema: Record<"face", Vector3> & Omit<Object3DSchema, "type">
  ) {
    return new Door({ ...schema });
  }

  clone() {
    let jsonV = this.toJson();
    jsonV.uuid = Helpers.uuid();
    return new Door(jsonV);
  }
}

export { Door };

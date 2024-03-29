import {
  Object3D,
  Object3DProps,
  Object3DSchema,
  Helpers,
  Entity,
  Observer,
} from "../system";
import { Wall } from "./Wall/Wall";

class Window implements Object3D {
  private observers: Observer[] = [];

  attachedWall: {
    wall: Wall;
    centerOffset: number;
  } | null = null;

  uuid;
  dimension;
  rotation;
  position;

  type = Entity.WINDOW;

  constructor(props?: Object3DProps) {
    if (!props) {
      this.uuid = Helpers.uuid();
      this.dimension = { width: 0.1, depth: 1, height: 1 };
      this.rotation = { w: 0, x: 0, y: 0, z: 0 };
      this.position = { x: 0, y: 0, z: 0 };
    } else {
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

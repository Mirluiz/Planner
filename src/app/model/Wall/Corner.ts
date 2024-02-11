import {
  Helpers,
  Object3D,
  Object3DProps,
  Object3DSchema,
  Entity,
} from "../../system";
import { Wall } from "./Wall";
import { Observer } from "../../system/interfaces/Observer";

export type CornerProps = Object3DProps & { walls: Array<string> };

class Corner implements Object3D {
  walls: Array<string> = [];
  private observers: Observer[] = [];

  uuid;
  dimension;
  rotation;
  position;

  type = Entity.CORNER;

  constructor(props: Partial<CornerProps>) {
    this.uuid = props.uuid ?? Helpers.uuid();
    this.dimension = props.dimension ?? { width: 0.1, depth: 1, height: 1 };
    this.rotation = props.rotation ?? { w: 0, x: 0, y: 0, z: 0 };
    this.position = props.position ?? { x: 0, y: 0, z: 0 };
    this.walls = props?.walls ?? [];
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
      observer.destroy();
    }
  }

  static fromJson(schema: CornerProps) {
    return new Corner({ ...schema });
  }

  toJson() {
    return {
      uuid: this.uuid,
      dimension: this.dimension,
      rotation: this.rotation,
      position: this.position,
      type: Entity.CORNER,
      walls: [...this.walls],
    };
  }

  clone() {
    return new Corner(this.toJson());
  }
}

export { Corner };

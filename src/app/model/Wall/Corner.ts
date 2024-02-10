import {
  Helpers,
  Object3D,
  Object3DProps,
  Object3DSchema,
  Entity,
} from "../../system";
import { Wall } from "./Wall";
import { Observer } from "../../system/interfaces/Observer";

class Corner implements Object3D {
  walls: Array<Wall> = [];
  private observers: Observer[] = [];

  uuid;
  dimension;
  rotation;
  position;

  type = Entity.CORNER;

  constructor(props: Object3DProps) {
    this.uuid = props.uuid ?? Helpers.uuid();
    this.dimension = props.dimension ?? { width: 0.1, depth: 1, height: 1 };
    this.rotation = props.rotation ?? { w: 0, x: 0, y: 0, z: 0 };
    this.position = props.position ?? { x: 0, y: 0, z: 0 };
  }

  addObserver(observer: Observer) {
    this.observers.push(observer);
  }

  notifyObservers() {
    for (const observer of this.observers) {
      observer.trigger();
    }
  }

  // update() {
  //   this.walls.map((wall) => {
  //     if (wall.end.object?.uuid === this.uuid) {
  //       wall.end.set(this.position.x, this.position.y, this.position.z);
  //     } else {
  //       wall.end.object?.walls.map((w) => {
  //         w.updateAngle();
  //         w.notifyObservers();
  //       });
  //     }
  //
  //     if (wall.start.object?.uuid === this.uuid) {
  //       wall.start.set(this.position.x, this.position.y, this.position.z);
  //     } else {
  //       wall.start.object?.walls.map((w) => {
  //         w.updateAngle();
  //         w.notifyObservers();
  //       });
  //     }
  //
  //     wall.updateCenter();
  //     wall.updateAngle();
  //     wall.notifyObservers();
  //   });
  // }

  destroy() {
    for (const observer of this.observers) {
      observer.destroy();
    }
  }

  static fromJson(schema: Omit<Object3DSchema, "type">) {
    return new Corner({ ...schema });
  }

  toJson() {
    return {
      uuid: this.uuid,
      dimension: this.dimension,
      rotation: this.rotation,
      position: this.position,
      type: Entity.CORNER,
    };
  }

  clone() {
    return new Corner(this.toJson());
  }
}

export { Corner };

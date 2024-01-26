import {
  Geometry,
  Entity,
  Helpers,
  Object3D,
  Object3DProps,
  Object3DSchema,
} from "../../system";
import { Vector3 } from "three";
import { Observer } from "../../system/interfaces/Observer";
import { WallEnd } from "./WallEnd";

class Wall implements Object3D, Geometry.Line {
  isWall = true;

  hovered = false;
  focused = false;
  active = false;

  uuid;
  dimension;
  rotation;
  position;

  private observers: Observer[] = [];

  type = Entity.WALL;

  start: WallEnd;
  end: WallEnd;

  startAngle: number = 0;
  endAngle: number = 0;

  constructor(
    props: {
      start: Geometry.Vector3;
      end: Geometry.Vector3;
    } & Object3DProps
  ) {
    this.start = new WallEnd(props.start.x, props.start.y, props.start.z);
    this.end = new WallEnd(props.end.x, props.end.y, props.end.z);

    this.uuid = props.uuid ?? Helpers.uuid();
    this.dimension = { width: 1, height: 1, depth: 1 };
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

  update(props: Partial<Object3DProps>) {
    if (props.position) {
      let reservedPosition = { ...this.position };
      this.position = { ...props.position };

      let ln = this.start.distanceTo(this.end);

      let reservedCenterVector = new Vector3(
        reservedPosition.x,
        reservedPosition.y,
        reservedPosition.z
      );

      let centerVector = new Vector3(
        this.position.x,
        this.position.y,
        this.position.z
      );

      let fromCenterToStart = this.start.clone().sub(reservedCenterVector);
      let fromCenterToEnd = this.end.clone().sub(reservedCenterVector);

      let startVector = centerVector
        .clone()
        .sub(fromCenterToStart.normalize().multiplyScalar(ln * 0.5));

      let endVector = centerVector
        .clone()
        .sub(fromCenterToEnd.normalize().multiplyScalar(ln * 0.5));

      this.start.set(startVector.x, startVector.y, startVector.z);
      this.end.set(endVector.x, endVector.y, endVector.z);
    }
  }

  destroy() {
    for (const observer of this.observers) {
      observer.trigger();
    }
  }

  static fromJson(schema: Object3DSchema) {
    if (!schema.start || !schema.end) return;

    const wall = new Wall({
      start: new WallEnd(schema.start.x, schema.start.y, schema.start.z),
      end: new WallEnd(schema.end.x, schema.end.y, schema.end.z),
    });

    wall.position = schema.position;
    wall.rotation = schema.rotation;
    wall.uuid = schema.uuid;
    wall.dimension = schema.dimension;

    return wall;
  }

  toJson() {
    return {
      uuid: this.uuid,
      dimension: this.dimension,
      rotation: this.rotation,
      position: this.position,

      start: {
        x: this.start.x,
        y: this.start.y,
        z: this.start.z,
        object: this.start.object,
      },
      end: {
        x: this.end.x,
        y: this.end.y,
        z: this.end.z,
        object: this.end.object,
      },
      type: Entity.WALL,
    };
  }
}

export { Wall };

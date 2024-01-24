import {
  Object3D,
  Object3DProps,
  Object3DSchema,
  Engine,
  Helpers,
  Geometry,
  Entity,
} from "../../system";
import * as THREE from "three";
import { Vector3 } from "three";
import { Observer } from "../../system/interfaces/Observer";

class Pipe implements Object3D, Geometry.Line {
  isPipe = true;
  private observers: Array<Observer> = [];

  flow: "red" | "blue";

  uuid;
  dimension;
  rotation;
  position;

  start: Vector3;
  end: Vector3;

  type = Entity.PIPE;

  constructor(
    props: {
      start: Vector3;
      end: Vector3;
      flow: "red" | "blue";
    } & Object3DProps
  ) {
    this.start = new Vector3(props.start.x, props.start.y, props.start.z);
    this.end = new Vector3(props.end.x, props.end.y, props.end.z);

    this.uuid = props.uuid ?? Helpers.uuid();
    this.dimension = { width: 1, height: 1, depth: 1 };
    this.rotation = props.rotation ?? { w: 0, x: 0, y: 0, z: 0 };
    this.position = props.position ?? { x: 0, y: 0, z: 0 };

    this.flow = props?.flow ?? "blue";
  }

  addObserver(observer: Observer) {
    this.observers.push(observer);
  }

  notifyObservers() {
    for (const observer of this.observers) {
      observer.update();
    }
  }

  static fromJson(schema: Object3DSchema) {
    if (!schema.start || !schema.end || !schema.flow) return;

    const pipe = new Pipe({
      start: new Vector3(schema.start.x, schema.start.y, schema.start.z),
      end: new Vector3(schema.end.x, schema.end.y, schema.end.z),
      flow: schema.flow,
    });

    pipe.position = schema.position;
    pipe.rotation = schema.rotation;
    pipe.uuid = schema.uuid;
    pipe.dimension = schema.dimension;

    return pipe;
  }

  toJson() {
    return {
      uuid: this.uuid,
      dimension: this.dimension,
      rotation: this.rotation,
      position: this.position,

      start: { ...this.start },
      end: { ...this.end },
      type: Entity.PIPE,
      flow: this.flow,
    };
  }
}

export { Pipe };

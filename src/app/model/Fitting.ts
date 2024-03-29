import {
  Object3D,
  Object3DProps,
  Object3DSchema,
  Geometry,
  Helpers,
  Engine,
  Entity,
} from "../system";
import * as THREE from "three";
import { Observer } from "../system/interfaces/Observer";

class Fitting implements Object3D {
  private observers: Observer[] = [];

  uuid;
  dimension;
  rotation;
  position;

  type = Entity.FITTING;

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

  onUpdate() {
    console.log("=");
  }

  destroy() {
    for (const observer of this.observers) {
      observer.trigger();
    }
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
    return new Fitting({ ...schema });
  }

  clone() {
    return new Fitting(this.toJson());
  }
}

export { Fitting };

import { Helpers } from "../../system";
import { Entity, Observer } from "../Interfaces";

interface Object3DProps {
  uuid?: string;
  dimension?: {
    width: number;
    height: number;
    depth: number;
  };

  position?: {
    x: number;
    y: number;
    z: number;
  };

  start?: { x: number; y: number; z: number; object: string | null };
  end?: { x: number; y: number; z: number; object: string | null };

  rotation?: {
    w: number;
    x: number;
    y: number;
    z: number;
  };
}

interface Schema {
  position: {
    x: number;
    y: number;
    z: number;
  };

  rotation: {
    w: number;
    x: number;
    y: number;
    z: number;
  };

  uuid: string;
  dimension: {
    width: number;
    height: number;
    depth: number;
  };

  type: Entity;

  flow?: "blue" | "red";
}

interface Object3D {
  position: {
    x: number;
    y: number;
    z: number;
  };
  rotation: {
    w: number;
    x: number;
    y: number;
    z: number;
  };
  uuid: string;
  dimension: {
    width: number;
    height: number;
    depth: number;
  };
  type: Entity | null

  toJson: () => Schema;
  addObserver: (observer: Observer) => void;
  notifyObservers: () => void;
  destroy: () => void;
  clone: () => Object3D;
}

class Basic3D implements Object3D {
  isObject = true;
  uuid;
  dimension;
  rotation;
  position;
  type: Entity | null = null
  observers: Observer[] = [];

  constructor(props: Object3DProps) {
    this.uuid = props.uuid ?? Helpers.uuid();
    this.dimension = props.dimension ?? { width: 0.1, depth: 1, height: 1 };
    this.rotation = props.rotation ?? { w: 0, x: 0, y: 0, z: 0 };
    this.position = props.position ?? { x: 0, y: 0, z: 0 };
  }

  toJson () {
    return {
      uuid: this.uuid,
      dimension: this.dimension,
      rotation: this.rotation,
      position: this.position,
      type: Entity.CORNER,
    };
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
  
  clone (): Object3D {
    throw new Error("not implemented");
    return this
  }
}

export { Object3D, Object3DProps, Schema as Object3DSchema, Basic3D };

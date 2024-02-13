import { Engine } from "./Engine";
import { Entity } from "./Entity";
import { Observer } from "./Observer";

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

  type: Entity;

  toJson: () => Schema;

  addObserver: (observer: Observer) => void;
  notifyObservers: () => void;

  destroy: () => void;
  clone: () => Object3D;
}

export { Object3D, Object3DProps, Schema as Object3DSchema };

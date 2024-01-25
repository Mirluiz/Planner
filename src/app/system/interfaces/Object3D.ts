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

  start?: { x: number; y: number; z: number };
  end?: { x: number; y: number; z: number };

  flow?: "blue" | "red";
}

interface Object3D {
  hovered: boolean;
  focused: boolean;
  active: boolean;

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

  onUpdate: () => void;
  destroy: () => void;
}

export { Object3D, Object3DProps, Schema as Object3DSchema };

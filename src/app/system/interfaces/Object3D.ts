import { Engine } from "./Engine";
import { Entity } from "./Entity";

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
  mesh: Engine.Mesh | null;

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

  render: () => Engine.Mesh | null;
  update: () => void;
  destroy: () => void;

  toJson: () => Schema;
}

export { Object3D, Object3DProps, Schema as Object3DSchema };

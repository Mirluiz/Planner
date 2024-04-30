import { Object3D } from "../model/Object3D";

interface Controller {
  model?: Object3D | null;
  create: (...args: any[]) => Object3D | null;
  update: (...args: any[]) => Object3D | null;
  reset: () => void;
  remove: () => void;

  mouseDown: (pos: { x: number; y: number; z: number }) => void;
  mouseUp: (pos: { x: number; y: number; z: number }) => void;
  mouseMove: (pos: { x: number; y: number; z: number }) => void;
}

export { Controller };

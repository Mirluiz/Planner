import { Object3D } from "../controller/Object3D";

interface Drawing {
  active: Object3D | null;
  reset: () => void;
  startDraw: (props: { x: number; y: number; z: number }) => void;
  draw: (props: { x: number; y: number; z: number }) => void;
}

export { Drawing };

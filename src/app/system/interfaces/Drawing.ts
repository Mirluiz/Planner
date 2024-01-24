import { Geometry, Object3D } from "./../";

interface Drawing {
  active: Object3D | null;
  reset: () => void;
  startDraw: (props: { x: number; y: number; z: number }) => void;
  draw: (props: { x: number; y: number; z: number }) => void;
}

export { Drawing };

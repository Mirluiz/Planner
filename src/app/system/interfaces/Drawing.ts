import { Geometry } from "./../";

interface Drawing {
  active: Geometry.Line | null;
  reset: () => void;
  startDraw: (props: { x: number; y: number; z: number }) => void;
  draw: (props: { x: number; y: number; z: number }) => void;
}

export { Drawing };

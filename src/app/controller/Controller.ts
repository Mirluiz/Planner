import { Object3D } from "../system";

interface Controller {
  create: (...args: any[]) => Object3D | null;
  update: (...args: any[]) => Object3D | null;
  reset: () => void;
  remove: () => void;
}

export { Controller };

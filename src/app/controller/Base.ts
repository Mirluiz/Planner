import { EventSystem, Object3D, Mesh } from "../system";
import { Scene as SceneController } from "../controller/Scene";
import { App } from "../App";
import { Controller } from "./Controller";
import { Scene as SceneModel } from "./../model/Scene";

class Base<M extends Object3D = Object3D, V extends Mesh = Mesh>
  implements Controller
{
  model: M | null = null;
  view: V | null = null;
  event: EventSystem = new EventSystem();

  constructor(
    readonly app: App,
    readonly sceneController: SceneController,
  ) {}

  create(...args: any[]): M | null {
    throw new Error("not implemented");
  }

  update(...args: any[]): M | null {
    throw new Error("not implemented");
  }

  reset() {
    throw new Error("not implemented");
  }

  remove() {
    throw new Error("not implemented");
  }

  mouseUp(pos: { x: number; y: number; z: number }) {
    throw new Error("not implemented");
  }

  mouseDown(pos: { x: number; y: number; z: number }) {
    throw new Error("not implemented");
  }

  mouseMove(pos: { x: number; y: number; z: number }) {
    throw new Error("not implemented");
  }
}

export { Base };

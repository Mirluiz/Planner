import { Object3D as Object3DModel, Math2D } from "../system";
import { Scene as SceneModel } from "../model/Scene";
import { Fitting, Pipe as PipeModel } from "../model";
import { Controller } from "./Controller";

class Object3D implements Controller {
  readonly scene: SceneModel;
  activeModel: Object3DModel | null = null;

  private tempFitting: Array<Fitting> = [];

  constructor(props: { scene: SceneModel }) {
    this.scene = props.scene;
  }

  create(props: { [key: string]: any }) {
    if (this.activeModel) this.addObject(this.activeModel);

    return this.activeModel;
  }
  update(props: { [key: string]: any }) {
    return this.activeModel;
  }
  remove() {}

  reset() {
    this.activeModel = null;
  }

  addObject(object: Object3DModel) {
    this.scene.addObject(object);
  }
}

export { Object3D };

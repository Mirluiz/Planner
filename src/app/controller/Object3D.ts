import { Fitting, Pipe as PipeModel, Scene as SceneModel } from "../model";
import { Object3D as Object3DModel } from "../model/Object3D";
import { Controller } from "./Controller";

class Object3D implements Controller {
  readonly scene: SceneModel;
  model: Object3DModel | null = null;
  activeModel: Object3DModel | null = null;

  constructor(props: { scene: SceneModel }) {
    this.scene = props.scene;
  }

  create(props: { x: number; y: number; z: number }) {
    if (this.model) {
      this.activeModel = null;
      this.activeModel = this.model?.clone();
      this.activeModel.position = { ...props };

      this.addObject(this.activeModel);
    }

    return this.activeModel;
  }

  update(props: { x: number; y: number; z: number }) {
    if (this.activeModel) {
      this.activeModel.position = { ...props };
    }

    return this.activeModel;
  }

  remove() {}

  reset() {
    if (this.activeModel?.uuid) this.scene.removeObject(this.activeModel.uuid);
    this.activeModel = null;
  }

  addObject(object: Object3DModel) {
    this.scene.addObject(object);
  }

  mouseUp() {}

  mouseDown() {}

  mouseMove() {}
}

export { Object3D };

import { Math2D } from "../../system";
import { Fitting, Pipe as PipeModel, Wall as WallModel } from "../model";
import { Pipe as PipeView } from "./../view";
import { Vector3 } from "three";
import { Controller } from "./Controller";
import { App } from "../App";
import { Scene as SceneController } from "./Scene";
import { Base } from "./Base";

class Pipe extends Base implements Controller {
  model: PipeModel | null = null;
  view: PipeView | null = null;

  private tempFitting: Array<Fitting> = [];

  constructor(readonly app: App, readonly sceneController: SceneController) {
    super(app, sceneController);

    this.model = PipeModel.createDefault();
    this.view = new PipeView(this.model);
  }

  create(props: { [key: string]: any }) {
    return this.model;
  }
  update(props: { [key: string]: any }) {
    return this.model;
  }
  remove() {}

  reset() {
    this.model = null;
  }

  get pipes() {
    return this.sceneController.model.objects.filter(
      (obj): obj is PipeModel => {
        if (obj instanceof PipeModel) {
          return Math2D.Line.isLine(obj);
        } else return false;
      }
    );
  }
 
  moveEnd(end: Vector3, pos: { x: number; y: number; z: number }) {
    end.set(pos.x, pos.y, pos.z);
  }
 

  startDraw() {}

  draw() {}
}

export { Pipe };

import { Entity } from "../../system";
import { Controller } from "../Controller";
import {
  Corner as CornerModel,
  Door as DoorModel,
  Door,
  Wall,
} from "../../model";
import { Door as DoorView } from "../../view/Door";
import { Vector3 } from "three";
import { Base } from "../Base";
import { WallUpdates } from "./WallUpdates";
import { DoorUpdates } from "./DoorUpdates";

class Corner extends Base implements Controller {
  model: DoorModel | null = null;
  view: DoorView | null = null;

  get doors() {
    return (
      this.sceneController.model?.objects.filter((obj): obj is Door => {
        return obj instanceof Door;
      }) ?? []
    );
  }

  update(
    props: Partial<{
      pos: Vector3;
    }>,
    model: CornerModel,
  ) {
    WallUpdates.updateWallsByCorner(
      this.sceneController.model.objects.filter(
        (obj): obj is Wall => obj.type === Entity.WALL,
      ),
      model,
      this.sceneController,
    );
    DoorUpdates.doorsByCorner(this.doors, model, this.sceneController);
    this.app.graphManager.update();

    return model ?? null;
  }

  reset() {
    this.sceneController.activeController = null;

    this.model?.destroy();
    this.view?.destroy();

    this.model = null;
    this.view = null;
  }

  remove() {
    return this.model ?? null;
  }
}

export { Corner };

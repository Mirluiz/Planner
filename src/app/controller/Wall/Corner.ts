import { Math2D } from "../../system";
import { Controller } from "../Controller";
import {
  Door,
  Door as DoorModel,
  Wall as WallModel,
  Wall,
  Corner as CornerModel,
} from "../../model";
import { Door as DoorView } from "../../view/Door";
import { Vector3 } from "three";
import { Base } from "../Base";
import { WallUpdates } from "./WallUpdates";

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
    model: CornerModel
  ) {
    model.update();
    WallUpdates.updateDoorsByCorner(this.doors, model);

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

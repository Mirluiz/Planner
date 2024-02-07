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
    this.updateDoors(model);

    return model ?? null;
  }

  updateDoors(model: CornerModel) {
    this.doors.map((door) => {
      model.walls.map((wall) => {
        if (door.attachedWall?.wall.uuid === wall.uuid) {
          let doorPos = new Vector3(
            door.position.x,
            door.position.y,
            door.position.z
          );
          let modelPos = new Vector3(
            wall.position.x,
            wall.position.y,
            wall.position.z
          );
          let normal = wall.end.clone().sub(wall.start).normalize();

          let finalPos = modelPos
            .clone()
            .add(normal.multiplyScalar(-door.attachedWall.centerOffset ?? 1));

          door.position = { x: finalPos.x, y: finalPos.y, z: finalPos.z };

          let angle = wall.end.clone().sub(wall.start.clone()).normalize();
          door.rotation.y = Math.PI - Math.atan2(angle.z, angle.x);

          door.notifyObservers();
        }
      });
    });
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

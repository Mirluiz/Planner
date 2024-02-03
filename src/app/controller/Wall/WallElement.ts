import { Math2D, Object3D } from "../../system";
import { Controller } from "../Controller";
import { Door, Wall as WallModel, Wall } from "../../model";
import { Scene as SceneModel } from "../../model/Scene";
import { Vector3 } from "three";
import { Base } from "../Base";

class WallElement extends Base implements Controller {
  get walls() {
    return (
      this.sceneController.model?.objects.filter((obj): obj is WallModel => {
        if (obj instanceof WallModel) {
          return Math2D.Line.isLine(obj);
        } else return false;
      }) ?? []
    );
  }

  create() {
    return this.model ?? null;
  }

  update(props: { position: { x: number; y: number; z: number } }) {
    let { intersects } = this.sceneController.model;
    let firstObject = intersects[0]?.object?.model;

    if (firstObject instanceof Wall) {
      let angle = firstObject.end
        .clone()
        .sub(firstObject.start.clone())
        .normalize();
      if (this.model)
        this.model.rotation.y = Math.PI - Math.atan2(angle.z, angle.x);
    }

    if (this.model) {
      let { position } = this.model;

      let snapsByDistance = Math2D.Line.seekSnap(
        this.walls,
        new Vector3(position.x, position.y, position.z)
      );

      let firstObject = snapsByDistance[0];

      if (firstObject && firstObject.distance < 2 && firstObject.object) {
        let angle = firstObject.object.end
          .clone()
          .sub(firstObject.object.start.clone())
          .normalize();
        this.model.rotation.y = Math.PI - Math.atan2(angle.z, angle.x);
        this.model.position = { ...firstObject.position };
        // this.model.attachedWall = firstObject.object;
      }
    }

    return this.model ?? null;
  }

  reset() {
    console.log("==");
  }

  remove() {
    return this.model ?? null;
  }
}

export { WallElement };

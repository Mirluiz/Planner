import { Math2D } from "../../system";
import { Controller } from "../Controller";
import { Door as DoorModel, Wall as WallModel, Wall } from "../../model";
import { Door as DoorView } from "../../view/Door";
import { Vector3 } from "three";
import { Base } from "../Base";

class WallElement extends Base implements Controller {
  model: DoorModel | null = null;
  view: DoorView | null = null;
  private ghostView: DoorView | null = null;
  private ghostModel: DoorModel | null = null;

  get walls() {
    return (
      this.sceneController.model?.objects.filter((obj): obj is WallModel => {
        if (obj instanceof WallModel) {
          return Math2D.Line.isLine(obj);
        } else return false;
      }) ?? []
    );
  }

  create(pos: { x: number; y: number; z: number }) {
    let model = new DoorModel({
      position: new Vector3(pos.x, pos.y, pos.z),
    });

    let { intersects } = this.sceneController.model;
    let firstObject = intersects[0]?.object?.model;

    if (firstObject instanceof Wall) {
      let angle = firstObject.end
        .clone()
        .sub(firstObject.start.clone())
        .normalize();
      if (model) model.rotation.y = Math.PI - Math.atan2(angle.z, angle.x);
    }

    if (model) {
      let { position } = model;

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
        model.rotation.y = Math.PI - Math.atan2(angle.z, angle.x);
        model.position = { ...firstObject.position };
        model.attachedWall = firstObject.object;
      }
    }

    let view = new DoorView(model, this.app);

    if (view) {
      let render = view.render();
      if (render) this.sceneController.view?.engine?.scene.add(render);
    }

    this.sceneController.model.addObject(model);

    return model;
  }

  update(
    props: Partial<{
      pos: Vector3;
    }>,
    model: DoorModel
  ) {
    if (props.pos) model.position = { ...props.pos };

    let { intersects } = this.sceneController.model;
    let firstObject = intersects[0]?.object?.model;

    if (firstObject instanceof Wall) {
      let angle = firstObject.end
        .clone()
        .sub(firstObject.start.clone())
        .normalize();
      if (model) model.rotation.y = Math.PI - Math.atan2(angle.z, angle.x);
    }

    if (model) {
      let { position } = model;

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
        model.rotation.y = Math.PI - Math.atan2(angle.z, angle.x);
        model.position = { ...firstObject.position };
        // this.model.attachedWall = firstObject.object;
      }
    }

    model.notifyObservers();

    return model ?? null;
  }

  reset() {
    this.sceneController.activeController = null;

    this.model?.destroy();
    this.view?.destroy();

    this.model = null;
    this.view = null;

    this.ghostModel?.destroy();
    this.ghostView?.destroy();

    this.ghostModel = null;
    this.ghostView = null;
  }

  remove() {
    return this.model ?? null;
  }

  createGhost() {
    let newDoor = new DoorModel();

    this.ghostView = new DoorView(newDoor, this.app);
    this.ghostModel = newDoor;

    if (this.ghostView) {
      let render = this.ghostView.render();
      if (render) this.sceneController.view?.engine?.scene.add(render);
    }
  }

  mouseUp(pos: { x: number; y: number; z: number }) {}

  mouseDown(pos: { x: number; y: number; z: number }) {
    this.create(pos);
  }

  mouseMove(pos: { x: number; y: number; z: number }) {
    if (this.model instanceof DoorModel) {
      this.update({ pos: new Vector3(pos.x, pos.y, pos.z) }, this.model);
    }

    if (this.ghostModel) {
      this.update({ pos: new Vector3(pos.x, pos.y, pos.z) }, this.ghostModel);
    }
  }
}

export { WallElement };

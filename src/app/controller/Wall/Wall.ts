import { Wall as WallModel, Corner, Door } from "../../model/";
import { Math2D } from "../../system";
import { Controller } from "../Controller";
import { WallEnd } from "../../model/Wall/WallEnd";
import { GeometryCalculation } from "./GeometryCalculation";
import { Base } from "../Base";
import { Wall as WallView, Corner as CornerView } from "./../../view";
import { App } from "../../App";
import { Scene as SceneController } from "../Scene";
import { Vector3 } from "three";
import { WallUpdates } from "./WallUpdates";
import { DoorUpdates } from "./DoorUpdates";

class Wall extends Base implements Controller {
  model: WallModel | null = null;
  view: WallView | null = null;

  constructor(readonly app: App, readonly sceneController: SceneController) {
    super(app, sceneController);
  }

  get walls() {
    return (
      this.sceneController.model?.objects.filter((obj): obj is WallModel => {
        if (obj instanceof WallModel) {
          return Math2D.Line.isLine(obj);
        } else return false;
      }) ?? []
    );
  }

  get corners() {
    return (
      this.sceneController.model?.objects.filter((obj): obj is Corner => {
        return obj instanceof Corner;
      }) ?? []
    );
  }

  get doors() {
    return (
      this.sceneController.model?.objects.filter((obj): obj is Door => {
        return obj instanceof Door;
      }) ?? []
    );
  }

  create(props: { x: number; y: number; z: number }) {
    this.startDraw(props);

    if (this.view) {
      this.sceneController.view?.engine?.scene.add(this.view?.render2D());
    }

    return this.model;
  }

  update(
    props: Partial<{
      start: Vector3;
      end: Vector3;
    }>,
    model: WallModel
  ) {
    if (model) {
      if (props.start) {
        model.start.x = props.start.x;
        model.start.y = props.start.y;
        model.start.z = props.start.z;
      }
      if (props.end) {
        model.end.x = props.end.x;
        model.end.y = props.end.y;
        model.end.z = props.end.z;
      }

      model.updateCenter();

      WallUpdates.updateCorners(model, this.sceneController);
      DoorUpdates.doorsByWall(this.doors, model, this.sceneController);
    }

    WallUpdates.updateCorners(model, this.sceneController);
    this.updateWallAngles();

    model?.notifyObservers();

    return model;
  }

  remove() {}

  start(pos: { x: number; y: number; z: number }) {
    const newWall = new WallModel({
      start: new WallEnd({ x: pos.x, y: pos.y, z: pos.z }),
      end: new WallEnd({ x: pos.x, y: pos.y, z: pos.z }),
    });

    const corner = newWall?.start
      ? GeometryCalculation.getClosestCorner(newWall.start, this.corners)
      : null;
    const closest = newWall?.start
      ? GeometryCalculation.getClosestWall(newWall, newWall.start, this.walls)
      : null;

    if (corner) {
      corner.walls.push(newWall.uuid);
      newWall.start = new WallEnd({
        x: corner.position.x,
        y: 0,
        z: corner.position.z,
      });
      newWall.start.object = corner.uuid;
    } else if (closest && closest?.distance < 1) {
      this.connect(newWall, closest.object);
    }

    this.sceneController.model?.addObject(newWall);
    this.model = newWall;
    this.view = new WallView(this.model, this);
  }

  end(pos: { x: number; y: number; z: number }) {
    if (!this.model) return;

    this.moveEnd(this.model, "end", { ...pos });

    const corner = this.model
      ? GeometryCalculation.getClosestCorner(this.model.end, this.corners)
      : null;
    const closest = this.model
      ? GeometryCalculation.getClosestWall(
          this.model,
          this.model.end,
          this.walls
        )
      : null;

    if (this.model) {
      if (corner) {
        corner.walls.push(this.model.uuid);
        this.model.end.object = corner.uuid;
        this.model.end.x = corner.position.x;
        this.model.end.z = corner.position.z;
      } else if (closest && closest?.distance < 0.5) {
        this.connect(this.model, closest.object);
      }
    }

    this.model.updateCenter();
    this.model = null;
  }

  moveEnd(
    wall: WallModel,
    end: "start" | "end",
    pos: { x: number; y: number; z: number }
  ) {
    wall[end].set(pos.x, pos.y, pos.z);

    wall.updateCenter();
  }

  private connect(wall: WallModel, wallToConnect: WallModel) {
    const snap = GeometryCalculation.getWallSnap(wall, wallToConnect);

    if (!snap || snap.distance > 1) return;

    const { position } = snap;
    const wallToConnectEnd = GeometryCalculation.isItWallEnd(
      wallToConnect,
      position
    );

    if (wallToConnectEnd) {
      let corner = new Corner({
        position: { ...position },
      });

      let cornerView = new CornerView(corner, this.app);

      if (cornerView) {
        this.sceneController.view?.engine?.scene.add(cornerView.render2D());
      }

      corner.walls.push(wall.uuid);
      corner.walls.push(wallToConnect.uuid);

      snap.end.object = corner.uuid;
      wallToConnectEnd.object = corner.uuid;

      this.sceneController.model?.addObject(corner);
    } else {
      let corner = new Corner({
        position: { ...position },
      });

      /**
       *   old wall prev corner  * ------ new corner ----- * old wall next corner
       *                                      *
       *                                      *
       *                                      *
       *                                      *
       *                                this is active wall
       */
      let dividedWallFromPrevCorner = new WallModel({
        start: wallToConnect.start.clone(),
        end: new WallEnd({ x: position.x, y: position.y, z: position.z }),
      });
      dividedWallFromPrevCorner.start = wallToConnect.start;
      dividedWallFromPrevCorner.end.object = corner.uuid;

      let dividedWallToNextCorner = new WallModel({
        start: new WallEnd({ x: position.x, y: position.y, z: position.z }),
        end: wallToConnect.end.clone(),
      });
      dividedWallToNextCorner.start.object = corner.uuid;
      dividedWallToNextCorner.end = wallToConnect.end;

      corner.walls.push(dividedWallFromPrevCorner.uuid);
      corner.walls.push(dividedWallToNextCorner.uuid);
      corner.walls.push(wall.uuid);

      wall.end.object = corner.uuid;

      this.sceneController.model?.addObject(dividedWallFromPrevCorner);
      this.sceneController.model?.addObject(dividedWallToNextCorner);
      this.sceneController.model?.addObject(corner);

      let startCorner = this.sceneController.model.objects.find(
        (object) => object.uuid === wallToConnect.start.object
      ) as Corner;

      if (startCorner) {
        let wallIndex = startCorner.walls.findIndex(
          (wall) => wall === wallToConnect.uuid
        );

        if (wallIndex !== -1) {
          startCorner.walls.splice(wallIndex, 1);
        }

        startCorner.walls.push(dividedWallFromPrevCorner.uuid);
      }

      if (wallToConnect.end.object) {
        let wallIndex = startCorner.walls.findIndex(
          (wall) => wall === wallToConnect.uuid
        );

        if (wallIndex !== -1) {
          startCorner.walls.splice(wallIndex, 1);
        }

        startCorner.walls.push(dividedWallToNextCorner.uuid);
      }

      this.sceneController.model?.removeObject(wallToConnect.uuid);

      wallToConnect.destroy();

      this.model?.end.set(position.x, position.y, position.z);
    }
  }

  clearTempCorner() {
    let corner = this.sceneController.model?.objects.find(
      (obj): obj is Corner =>
        obj instanceof Corner && obj.walls.some((w) => w === this.model?.uuid)
    );

    if (corner) {
      const index = corner.walls.findIndex((w) => this.model?.uuid === w);

      if (index > -1) {
        corner.walls.splice(index, 1);
      }

      if (corner.walls.length < 2) {
        let _wall = this.sceneController.model.objectsBy[corner.walls[0]];

        if (_wall instanceof WallModel) {
          if (_wall.start.object === corner.uuid) {
            _wall.start.object = null;
          } else {
            _wall.end.object = null;
          }
        }

        this.sceneController.model?.removeObject(corner.uuid);
        corner.destroy();
      }
    }
  }

  startDraw(props: { x: number; y: number; z: number }) {
    this.model?.updateCenter();

    if (this.model) {
      this.end({ ...props });
      this.start({ ...props });
    } else {
      this.start({ ...props });
    }

    console.log("this.model?.end", this.model?.end);
  }

  draw(props: { x: number; y: number; z: number }) {
    if (this.model) {
      this.moveEnd(this.model, "end", { ...props });
    }
  }

  private updateWallAngles() {
    this.walls.map((wall) => {
      WallUpdates.updateAngle(wall, this.sceneController);
    });
  }

  reset() {
    if (this.model) {
      this.clearTempCorner();

      this.sceneController.model?.removeObject(this.model.uuid);

      this.model.destroy();
      this.model = null;
      this.view = null;
    }

    this.updateWallAngles();
  }

  mouseUp(pos: { x: number; y: number; z: number }) {}

  mouseDown(pos: { x: number; y: number; z: number }) {
    this.create(pos);
  }

  mouseMove(pos: { x: number; y: number; z: number }) {
    if (this.model)
      this.update({ end: new Vector3(pos.x, pos.y, pos.z) }, this.model);
  }
}

export { Wall };

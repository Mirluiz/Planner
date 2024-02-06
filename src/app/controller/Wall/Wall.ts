import { Wall as WallModel, Corner } from "../../model/";
import { Math2D } from "../../system";
import { Controller } from "../Controller";
import { WallEnd } from "../../model/Wall/WallEnd";
import { GeometryCalculation } from "./GeometryCalculation";
import { Base } from "../Base";
import { Wall as WallView } from "./../../view/Wall";
import { App } from "../../App";
import { Scene as SceneController } from "../Scene";
import { Vector3 } from "three";

class Wall extends Base<WallModel, WallView> implements Controller {
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

  create(props: { x: number; y: number; z: number }) {
    this.startDraw(props);
    if (this.view) {
      this.sceneController.view?.engine?.scene.add(this.view?.render());
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
    if (this.model) {
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
    }

    model.updateCorners();
    this.updateWallAngles();

    model?.notifyObservers();

    return model;
  }

  remove() {}

  start(pos: { x: number; y: number; z: number }) {
    const newWall = new WallModel({
      start: new WallEnd(pos.x, pos.y, pos.z),
      end: new WallEnd(pos.x, pos.y, pos.z),
    });

    const corner = newWall?.start
      ? GeometryCalculation.getClosestCorner(newWall.start, this.corners)
      : null;
    const closest = newWall?.start
      ? GeometryCalculation.getClosestWall(newWall, newWall.start, this.walls)
      : null;

    if (corner) {
      corner.walls.push(newWall);
      newWall.start = new WallEnd(corner.position.x, 0, corner.position.z);
      newWall.start.object = corner;
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
        corner.walls.push(this.model);
        this.model.end.object = corner;
        this.model.end.x = corner.position.x;
        this.model.end.z = corner.position.z;
      } else if (closest && closest?.distance < 0.5) {
        this.connect(this.model, closest.object);
      }
    }

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

      corner.walls.push(wall);
      corner.walls.push(wallToConnect);

      snap.end.object = corner;
      wallToConnectEnd.object = corner;

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
        end: new WallEnd(position.x, position.y, position.z),
      });
      dividedWallFromPrevCorner.start = wallToConnect.start;
      dividedWallFromPrevCorner.end.object = corner;

      let dividedWallToNextCorner = new WallModel({
        start: new WallEnd(position.x, position.y, position.z),
        end: wallToConnect.end.clone(),
      });
      dividedWallToNextCorner.start.object = corner;
      dividedWallToNextCorner.end = wallToConnect.end;

      corner.walls.push(dividedWallFromPrevCorner);
      corner.walls.push(dividedWallToNextCorner);
      corner.walls.push(wall);

      wall.end.object = corner;

      this.sceneController.model?.addObject(dividedWallFromPrevCorner);
      this.sceneController.model?.addObject(dividedWallToNextCorner);
      this.sceneController.model?.addObject(corner);

      if (wallToConnect.start.object) {
        let wallIndex = wallToConnect.start.object.walls.findIndex(
          (wall) => wall.uuid === wallToConnect.uuid
        );

        if (wallIndex !== -1) {
          wallToConnect.start.object.walls.splice(wallIndex, 1);
        }

        wallToConnect.start.object.walls.push(dividedWallFromPrevCorner);
      }

      if (wallToConnect.end.object) {
        let wallIndex = wallToConnect.end.object.walls.findIndex(
          (wall) => wall.uuid === wallToConnect.uuid
        );

        if (wallIndex !== -1) {
          wallToConnect.end.object.walls.splice(wallIndex, 1);
        }

        wallToConnect.end.object.walls.push(dividedWallToNextCorner);
      }

      this.sceneController.model?.removeObject(wallToConnect.uuid);

      wallToConnect.destroy();

      this.model?.end.set(position.x, position.y, position.z);
    }
  }

  clearTempCorner() {
    let corner = this.sceneController.model?.objects.find(
      (obj): obj is Corner =>
        obj instanceof Corner &&
        obj.walls.some((w) => w.uuid === this.model?.uuid)
    );

    if (corner) {
      const index = corner.walls.findIndex((w) => this.model?.uuid === w.uuid);

      if (index > -1) {
        corner.walls.splice(index, 1);
      }

      if (corner.walls.length < 2) {
        if (corner.walls[0].start.object?.uuid === corner.uuid) {
          corner.walls[0].start.object = null;
        } else {
          corner.walls[0].end.object = null;
        }

        this.sceneController.model?.removeObject(corner.uuid);
      }
    }
  }

  startDraw(props: { x: number; y: number; z: number }) {
    if (this.model) {
      this.end({ ...props });
      this.start({ ...props });
    } else {
      this.start({ ...props });
    }
  }

  draw(props: { x: number; y: number; z: number }) {
    if (this.model) {
      this.moveEnd(this.model, "end", { ...props });
    }
  }

  private updateWallAngles() {
    this.walls.map((wall) => {
      wall.updateAngle();
    });
  }

  reset() {
    if (this.model) {
      this.clearTempCorner();

      this.sceneController.model?.removeObject(this.model.uuid);
      // this.model = null;
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

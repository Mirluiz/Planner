import { Wall as WallModel, Corner } from "./../model/";
import { Scene as SceneController } from "../controller/Scene";
import { Room as RoomController } from "../controller/Room";
import { Drawing, Geometry, Graph, Math2D } from "../system";
import { Vector3 } from "three";

class Wall implements Drawing {
  readonly scene: SceneController;
  roomController: RoomController;

  active: WallModel | null = null;

  constructor(props: {
    scene: SceneController;
    roomController: RoomController;
  }) {
    this.scene = props.scene;
    this.roomController = props.roomController;
  }

  get walls() {
    return this.scene.model.objects.filter((obj): obj is WallModel => {
      if (obj instanceof WallModel) {
        return Math2D.Line.isLine(obj);
      } else return false;
    });
  }

  start(pos: { x: number; y: number; z: number }) {
    const newWall = new WallModel({
      start: new Vector3(pos.x, pos.y, pos.z),
      end: new Vector3(pos.x, pos.y, pos.z),
    });

    const corner = newWall?.start ? this.getClosestObject(newWall.start) : null;
    const closest = newWall?.start ? this.getClosestWall(newWall.start) : null;

    if (corner) {
      corner.walls.push(newWall);
    } else if (closest && closest?.distance < 1.5) {
      this.connect(newWall, closest.object);
    }

    this.addObject(newWall);
    this.active = newWall;
  }

  moveEnd(end: Vector3, pos: { x: number; y: number; z: number }) {
    end.set(pos.x, pos.y, pos.z);
  }

  end() {
    const corner = this.active ? this.getClosestObject(this.active.end) : null;
    const closest = this.active ? this.getClosestWall(this.active.end) : null;

    if (this.active) {
      if (corner) {
        corner.walls.push(this.active);
      } else if (closest && closest?.distance < 1.5) {
        this.connect(this.active, closest.object);
      }
    }

    this.active = null;
    this.checkForRoom();
  }

  private getClosestObject(coord: Vector3) {
    let corners = this.scene.model.objects.filter(
      (obj): obj is Corner => obj instanceof Corner
    );

    corners.sort(
      (a, b) =>
        coord.distanceTo(
          new Vector3(a.position.x, a.position.y, a.position.z)
        ) -
        coord.distanceTo(new Vector3(b.position.x, b.position.y, b.position.z))
    );

    let closest: Corner | undefined = corners[0];

    return closest &&
      coord.distanceTo(
        new Vector3(closest.position.x, closest.position.y, closest.position.z)
      ) < 1
      ? closest
      : null;
  }

  private getClosestWall(coord: Vector3): {
    distance: number;
    position: Vector3;
    object: WallModel;
  } | null {
    let snapsByDistance = Math2D.Line.seekSnap(this.walls, coord);

    let excludeItself = snapsByDistance.filter(
      (snap) => snap.object.uuid !== this.active?.uuid
    );

    const closest = excludeItself[0];

    return closest ?? null;
  }

  private getWallsIntersectionSnap(
    wall1: WallModel,
    wall2: WallModel
  ): {
    distance: number;
    position: Vector3;
  } | null {
    let ret = null;

    let wallStart = wall1.start;
    let wallEnd = wall1.end;

    let startDistance = Math2D.Line.getSnap(wallStart, wall2);
    let endDistance = Math2D.Line.getSnap(wallEnd, wall2);

    if (startDistance && endDistance) {
      ret =
        startDistance.distance > endDistance.distance
          ? endDistance
          : startDistance;
    }

    return ret;
  }

  private connect(wall: WallModel, dividedWall: WallModel) {
    const intersection = this.getWallsIntersectionSnap(wall, dividedWall);
    if (!intersection || intersection.distance > 1) return;

    const snapPos = intersection.position;

    const snapPosNet = Math2D.NetAlgorithms.netBind(
      new Vector3(snapPos.x, snapPos.y, snapPos.z)
    );

    let end = this.isItWallEnd(dividedWall, snapPos);

    if (end) {
      let corner = new Corner({
        position: { ...snapPosNet },
      });

      corner.walls.push(wall);
      corner.walls.push(dividedWall);
      this.addObject(corner);
    } else {
      let corner = new Corner({
        position: { ...snapPosNet },
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
        start: new Vector3(snapPosNet.x, snapPosNet.y, snapPosNet.z),
        end: new Vector3(snapPosNet.x, snapPosNet.y, snapPosNet.z),
      });
      dividedWallFromPrevCorner.start = dividedWall.start;
      dividedWallFromPrevCorner.end.set(
        snapPosNet.x,
        snapPosNet.y,
        snapPosNet.z
      );

      let dividedWallToNextCorner = new WallModel({
        start: new Vector3(),
        end: new Vector3(
          dividedWall.end.x,
          dividedWall.end.y,
          dividedWall.end.z
        ),
      });

      this.addObject(dividedWallFromPrevCorner);
      this.addObject(dividedWallToNextCorner);
      this.addObject(corner);

      this.scene.model.removeObject(dividedWall.uuid);
      dividedWall.destroy();

      this.active?.end.set(snapPosNet.x, snapPosNet.y, snapPosNet.z);
    }
  }

  private isItWallEnd(wall: WallModel, pos: Vector3): "start" | "end" | null {
    return Math2D.Line.isEnd(wall, pos);
  }

  clearTempCorner() {
    let corner = this.scene.model.objects.find(
      (obj): obj is Corner =>
        obj instanceof Corner &&
        obj.walls.some((w) => w.uuid === this.active?.uuid)
    );

    if (corner) {
      const index = corner.walls.findIndex((w) => this.active?.uuid === w.uuid);

      if (index > -1) {
        corner.walls.splice(index, 1);
      }

      if (corner.walls.length < 2) {
        this.scene.model.removeObject(corner.uuid);
        corner.destroy();
      }
    }
  }

  private addObject(object: WallModel | Corner) {
    this.scene.model.addObject(object);
  }

  reset() {
    if (this.active) {
      this.clearTempCorner();

      this.scene.model.removeObject(this.active.uuid);
      this.active?.destroy();
      this.active = null;
    }
  }

  startDraw(props: { x: number; y: number; z: number }) {
    if (this.active) {
      this.end();
      this.start({ ...props });
    } else {
      this.start({ ...props });
    }
  }

  draw(props: { x: number; y: number; z: number }) {
    if (this.active) {
      this.moveEnd(this.active.end, { ...props });
    }
  }

  private checkForRoom() {
    let walls = this.scene.model.objects.filter(
      (obj): obj is WallModel => obj instanceof WallModel
    );

    let corners = this.scene.model.objects.filter(
      (obj): obj is Corner => obj instanceof Corner
    );

    let graph = new Graph();

    walls.map((wall) => {
      let from: Corner | undefined = corners.find((obj): obj is Corner =>
        obj.walls.some((w) => w.uuid === wall.uuid)
      );
      let to: Corner | undefined = corners.find(
        (obj): obj is Corner =>
          obj.walls.some((w) => w.uuid === wall.uuid) && obj.uuid !== from?.uuid
      );

      if (from && to) {
        graph.addEdge(
          { val: from.uuid, pos: from.position },
          { val: to.uuid, pos: to.position }
        );
      }
    });

    let cycles = graph.getCycles();
    let roomCorners: Array<Array<Corner>> = [];

    cycles.map((cycle) => {
      let _corners: Array<Corner> = [];

      cycle.map((uuid) => {
        let corner: Corner | undefined = corners.find(
          (obj): obj is Corner => obj.uuid === uuid
        );

        if (corner) _corners.push(corner);
      });

      roomCorners.push(_corners);
    });

    this.roomController.updateByCorners(roomCorners);
  }
}

export { Wall };

import { Wall as WallModel, Corner } from "./../model/";
import { Scene as SceneModel } from "../model/Scene";
import { Math2D } from "../system";
import { Vector3 } from "three";
import { Controller } from "./Controller";
import { WallEnd } from "../model/Wall/WallEnd";

class Wall implements Controller {
  readonly scene: SceneModel;

  activeModel: WallModel | null = null;

  constructor(props: { scene: SceneModel }) {
    this.scene = props.scene;
  }

  create(props: { x: number; y: number; z: number }) {
    this.startDraw(props);

    return this.activeModel;
  }

  update(props: { x: number; y: number; z: number }) {
    this.draw(props);
    this.updateWallAngles();
    return this.activeModel;
  }

  remove() {}

  get walls() {
    return this.scene.objects.filter((obj): obj is WallModel => {
      if (obj instanceof WallModel) {
        return Math2D.Line.isLine(obj);
      } else return false;
    });
  }

  get corners() {
    return this.scene.objects.filter((obj): obj is Corner => {
      return obj instanceof Corner;
    });
  }

  start(pos: { x: number; y: number; z: number }) {
    const newWall = new WallModel({
      start: new WallEnd(pos.x, pos.y, pos.z),
      end: new WallEnd(pos.x, pos.y, pos.z),
    });

    const corner = newWall?.start ? this.getClosestObject(newWall.start) : null;
    const closest = newWall?.start ? this.getClosestWall(newWall.start) : null;

    if (corner) {
      corner.walls.push(newWall);
      newWall.start = new WallEnd(corner.position.x, 0, corner.position.z);
      newWall.start.object = corner;
    } else if (closest && closest?.distance < 1) {
      this.connect(newWall, closest.object);
    }

    newWall.active = true;
    this.addObject(newWall);
    this.activeModel = newWall;
  }

  end(pos: { x: number; y: number; z: number }) {
    if (!this.activeModel) return;

    this.moveEnd(this.activeModel, "end", { ...pos });

    const corner = this.activeModel
      ? this.getClosestObject(this.activeModel.end)
      : null;
    const closest = this.activeModel
      ? this.getClosestWall(this.activeModel.end)
      : null;

    if (this.activeModel) {
      if (corner) {
        corner.walls.push(this.activeModel);
        this.activeModel.end.object = corner;
        this.activeModel.end.x = corner.position.x;
        this.activeModel.end.z = corner.position.z;
      } else if (closest && closest?.distance < 0.5) {
        this.connect(this.activeModel, closest.object);
      }
    }

    this.activeModel.active = false;
    this.activeModel = null;
  }

  moveEnd(
    wall: WallModel,
    end: "start" | "end",
    pos: { x: number; y: number; z: number }
  ) {
    wall[end].set(pos.x, pos.y, pos.z);

    wall.updateCenter();
  }

  private getClosestObject(coord: Vector3) {
    let corners = this.scene.objects.filter(
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
      ) < 0.5
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
      (snap) => snap.object.uuid !== this.activeModel?.uuid
    );

    const closest = excludeItself[0];

    return closest ?? null;
  }

  private getWallSnap(
    wall1: WallModel,
    wall2: WallModel
  ): {
    distance: number;
    position: Vector3;
    end: WallEnd;
  } | null {
    let ret: {
      distance: number;
      position: Vector3;
      end: WallEnd;
    } | null = null;

    let pipeStart = wall1.start;
    let pipeEnd = wall1.end;

    let startDistance = Math2D.Line.getSnap(pipeStart, wall2);
    let endDistance = Math2D.Line.getSnap(pipeEnd, wall2);

    if (startDistance !== null && endDistance !== null) {
      ret =
        startDistance.distance > endDistance.distance
          ? {
              ...endDistance,
              end: wall1.end,
            }
          : {
              ...startDistance,
              end: wall1.start,
            };
    } else if (startDistance !== null) {
      ret = {
        ...startDistance,
        end: wall1.start,
      };
    } else if (endDistance !== null) {
      ret = {
        ...endDistance,
        end: wall1.end,
      };
    }

    return ret;
  }

  private connect(wall: WallModel, wallToConnect: WallModel) {
    const snap = this.getWallSnap(wall, wallToConnect);

    if (!snap || snap.distance > 1) return;

    const { position } = snap;
    const wallToConnectEnd = this.isItWallEnd(wallToConnect, position);

    if (wallToConnectEnd) {
      let corner = new Corner({
        position: { ...position },
      });

      corner.walls.push(wall);
      corner.walls.push(wallToConnect);

      snap.end.object = corner;
      wallToConnectEnd.object = corner;

      this.addObject(corner);
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

      this.addObject(dividedWallFromPrevCorner);
      this.addObject(dividedWallToNextCorner);
      this.addObject(corner);

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

      this.scene.removeObject(wallToConnect.uuid);

      wallToConnect.destroy();

      this.activeModel?.end.set(position.x, position.y, position.z);
    }
  }

  private isItWallEnd(wall: WallModel, pos: Vector3): WallEnd | null {
    return Math2D.Line.isEnd(wall, pos) === "start" ? wall.start : wall.end;
  }

  clearTempCorner() {
    let corner = this.scene.objects.find(
      (obj): obj is Corner =>
        obj instanceof Corner &&
        obj.walls.some((w) => w.uuid === this.activeModel?.uuid)
    );

    if (corner) {
      const index = corner.walls.findIndex(
        (w) => this.activeModel?.uuid === w.uuid
      );

      if (index > -1) {
        corner.walls.splice(index, 1);
      }

      if (corner.walls.length < 2) {
        this.scene.removeObject(corner.uuid);
        // corner.destroy();
      }
    }
  }

  private addObject(object: WallModel | Corner) {
    this.scene.addObject(object);
  }

  startDraw(props: { x: number; y: number; z: number }) {
    if (this.activeModel) {
      this.end({ ...props });
      this.start({ ...props });
    } else {
      this.start({ ...props });
    }

    // this.roomController.updateGraph();
  }

  draw(props: { x: number; y: number; z: number }) {
    if (this.activeModel) {
      this.moveEnd(this.activeModel, "end", { ...props });
    }
  }

  onCornerUpdate(corner: Corner) {
    corner.walls.map((wall) => {
      if (wall.end.object?.uuid === corner.uuid) {
        wall.end.set(corner.position.x, corner.position.y, corner.position.z);
      } else {
        wall.end.object?.walls.map((w) => {
          this.updateWallAngle(w);
          w.notifyObservers();
        });
      }

      if (wall.start.object?.uuid === corner.uuid) {
        wall.start.set(corner.position.x, corner.position.y, corner.position.z);
      } else {
        wall.start.object?.walls.map((w) => {
          this.updateWallAngle(w);
          w.notifyObservers();
        });
      }

      wall.updateCenter();
      this.updateWallAngle(wall);
      wall.notifyObservers();
    });
  }

  onWallUpdate(w: WallModel) {
    let startCorner = w.start.object;
    let endCorner = w.end.object;

    if (startCorner) {
      startCorner.position = { x: w.start.x, y: w.start.y, z: w.start.z };
      startCorner.walls.map((wall) => {
        if (wall.uuid !== w.uuid && startCorner) {
          if (wall.end.object?.uuid === startCorner.uuid) {
            wall.end.set(
              startCorner.position.x,
              startCorner.position.y,
              startCorner.position.z
            );
          }

          if (wall.start.object?.uuid === startCorner.uuid) {
            wall.start.set(
              startCorner.position.x,
              startCorner.position.y,
              startCorner.position.z
            );
          }

          wall.updateCenter();
          wall.notifyObservers();
        }
      });

      startCorner.notifyObservers();
    }

    if (endCorner) {
      endCorner.position = { x: w.end.x, y: w.end.y, z: w.end.z };
      endCorner.walls.map((wall) => {
        if (wall.uuid !== w.uuid && endCorner) {
          if (wall.end.object?.uuid === endCorner.uuid) {
            wall.end.set(
              endCorner.position.x,
              endCorner.position.y,
              endCorner.position.z
            );
          }

          if (wall.start.object?.uuid === endCorner.uuid) {
            wall.start.set(
              endCorner.position.x,
              endCorner.position.y,
              endCorner.position.z
            );
          }

          wall.updateCenter();
          wall.notifyObservers();
        }
      });

      endCorner.notifyObservers();
    }

    this.updateWallAngles();

    // this.corners.map((corner) => {
    //   corner.notifyObservers();
    // });
    //
    // this.walls.map((wall) => {
    //   wall.notifyObservers();
    // });
  }

  private updateWallAngles() {
    this.walls.map((wall) => {
      this.updateWallAngle(wall);
    });
  }

  private updateWallAngle(wall: WallModel) {
    let startWalls = wall.start.object?.walls.filter(
      (_w) => _w.uuid !== wall.uuid
    );
    let endWalls = wall.end.object?.walls.filter((_w) => _w.uuid !== wall.uuid);

    let prevWall: WallModel | undefined;
    let nextWall: WallModel | undefined;

    if (startWalls) {
      prevWall = startWalls.sort(
        (a, b) => this.calculateTheta(a) - this.calculateTheta(b)
      )[0];
    }

    if (endWalls) {
      nextWall = endWalls.sort(
        (a, b) => this.calculateTheta(a) - this.calculateTheta(b)
      )[0];
    }

    {
      if (prevWall) {
        let nextWallOppositeEnd =
          prevWall.start.object?.uuid === wall.start.object?.uuid
            ? prevWall.end
            : prevWall.start;
        let currentNormal = nextWallOppositeEnd
          .clone()
          .sub(wall.start)
          .normalize();

        let nextNormal = wall.end.clone()?.sub(wall.start).normalize();

        if (currentNormal && nextNormal) {
          let angle = angleBetweenVectorsWithOrientation(
            currentNormal,
            nextNormal
          );

          wall.endAngle = angle / 2 - Math.PI / 2;
        }
      }
    }

    {
      if (nextWall) {
        let prevWallOppositeEnd =
          nextWall.start.object?.uuid === wall.end.object?.uuid
            ? nextWall.end
            : nextWall.start;
        let currentNormal = prevWallOppositeEnd
          .clone()
          .sub(wall.end)
          .normalize();
        let nextNormal = wall.start.clone()?.sub(wall.end).normalize();

        if (currentNormal && nextNormal) {
          let angle = angleBetweenVectorsWithOrientation(
            currentNormal,
            nextNormal
          );

          wall.startAngle = angle / 2 - Math.PI / 2;
        }
      }
    }
  }

  private calculateTheta(vector: WallModel): number {
    return Math.atan2(vector.position.z, vector.position.x) * (180 / Math.PI);
  }

  reset() {
    if (this.activeModel) {
      this.clearTempCorner();

      this.scene.removeObject(this.activeModel.uuid);
      this.activeModel.active = false;
      this.activeModel = null;
    }

    this.updateWallAngles();
  }
}

function angleBetweenVectorsWithOrientation(
  vectorA: Vector3,
  vectorB: Vector3
) {
  const crossProduct = vectorA.x * vectorB.z - vectorA.z * vectorB.x;
  const dotProduct = vectorA.x * vectorB.x + vectorA.z * vectorB.z;

  const angleRadians = Math.atan2(crossProduct, dotProduct);

  return angleRadians;
}

export { Wall };

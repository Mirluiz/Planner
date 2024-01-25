import { Wall as WallModel, Corner } from "./../model/";
import { Scene as SceneModel } from "../model/Scene";
import { Math2D } from "../system";
import { Vector3 } from "three";
import { Controller } from "./Controller";

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
      start: new Vector3(pos.x, pos.y, pos.z),
      end: new Vector3(pos.x, pos.y, pos.z),
    });

    const corner = newWall?.start ? this.getClosestObject(newWall.start) : null;
    const closest = newWall?.start ? this.getClosestWall(newWall.start) : null;

    if (corner) {
      corner.walls.push(newWall);
      newWall.connections.start = corner;
      newWall.start.x = corner.position.x;
      newWall.start.z = corner.position.z;
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
        this.activeModel.connections.end = corner;
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

  private getWallsIntersectionSnap(
    wall1: WallModel,
    wall2: WallModel
  ): {
    distance: number;
    position: Vector3;
    end: "start" | "end";
  } | null {
    let ret: {
      distance: number;
      position: Vector3;
      end: "start" | "end";
    } | null = null;

    let wallStart = wall1.start;
    let wallEnd = wall1.end;

    let startDistance = Math2D.Line.getSnap(wallStart, wall2);
    let endDistance = Math2D.Line.getSnap(wallEnd, wall2);

    if (startDistance !== null && endDistance !== null) {
      ret =
        startDistance.distance > endDistance.distance
          ? {
              ...endDistance,
              end: "end",
            }
          : {
              ...startDistance,
              end: "start",
            };
    } else if (startDistance !== null) {
      ret = {
        ...startDistance,
        end: "start",
      };
    } else if (endDistance !== null) {
      ret = {
        ...endDistance,
        end: "end",
      };
    }

    return ret;
  }

  private connect(wall: WallModel, wallToConnect: WallModel) {
    const intersection = this.getWallsIntersectionSnap(wall, wallToConnect);

    if (!intersection || intersection.distance > 1) return;

    const snapPos = intersection.position;

    // if (this.scene.view?.engine.netBinding) {
    //   const snapPosNet = Math2D.NetAlgorithms.netBind(
    //     new Vector3(snapPos.x, snapPos.y, snapPos.z)
    //   );
    //
    //   snapPos.set(snapPosNet.x, snapPosNet.y, snapPosNet.z);
    // }

    let end = this.isItWallEnd(wallToConnect, snapPos);

    if (end) {
      let corner = new Corner({
        position: { ...snapPos },
      });

      corner.walls.push(wall);
      corner.walls.push(wallToConnect);

      wall.connections[intersection.end] = corner;
      wallToConnect.connections[end] = corner;

      this.addObject(corner);
    } else {
      let corner = new Corner({
        position: { ...snapPos },
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
        end: new Vector3(snapPos.x, snapPos.y, snapPos.z),
      });
      dividedWallFromPrevCorner.connections.start =
        wallToConnect.connections.start;
      dividedWallFromPrevCorner.connections.end = corner;

      let dividedWallToNextCorner = new WallModel({
        start: new Vector3(snapPos.x, snapPos.y, snapPos.z),
        end: wallToConnect.end.clone(),
      });
      dividedWallToNextCorner.connections.start = corner;
      dividedWallToNextCorner.connections.end = wallToConnect.connections.end;

      corner.walls.push(dividedWallFromPrevCorner);
      corner.walls.push(dividedWallFromPrevCorner);
      corner.walls.push(dividedWallToNextCorner);
      corner.walls.push(wall);

      wall.connections.end = corner;

      this.addObject(dividedWallFromPrevCorner);
      this.addObject(dividedWallToNextCorner);
      this.addObject(corner);

      if (wallToConnect.connections.start instanceof Corner) {
        let wallIndex = wallToConnect.connections.start.walls.findIndex(
          (wall) => wall.uuid === wallToConnect.uuid
        );

        if (wallIndex !== -1) {
          wallToConnect.connections.start.walls.splice(wallIndex, 1);
        }

        wallToConnect.connections.start.walls.push(dividedWallFromPrevCorner);
      }

      if (wallToConnect.connections.end instanceof Corner) {
        let wallIndex = wallToConnect.connections.end.walls.findIndex(
          (wall) => wall.uuid === wallToConnect.uuid
        );

        if (wallIndex !== -1) {
          wallToConnect.connections.end.walls.splice(wallIndex, 1);
        }

        wallToConnect.connections.end.walls.push(dividedWallToNextCorner);
      }

      this.scene.removeObject(wallToConnect.uuid);

      wallToConnect.destroy();

      this.activeModel?.end.set(snapPos.x, snapPos.y, snapPos.z);
    }
  }

  private isItWallEnd(wall: WallModel, pos: Vector3): "start" | "end" | null {
    return Math2D.Line.isEnd(wall, pos);
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

  private updateWallAngles() {
    this.corners.map((corner, index, array) => {
      if (corner.walls.length > 1) {
        corner.walls.map((wall, index, array) => {
          let cornerPos = new Vector3(
            corner.position.x,
            corner.position.y,
            corner.position.z
          );
          let nextWall = array[(index + 1) % array.length];

          let wallOppositeEnd: undefined | "start" | "end";
          let nextWallOppositeEnd: undefined | "start" | "end";

          if (
            wall.connections.end instanceof Corner &&
            wall.connections.end.uuid === corner.uuid
          ) {
            wallOppositeEnd = "start";
          } else if (
            wall.connections.start instanceof Corner &&
            wall.connections.start.uuid === corner.uuid
          ) {
            wallOppositeEnd = "end";
          }

          if (
            nextWall.connections.end instanceof Corner &&
            nextWall.connections.end.uuid === corner.uuid
          ) {
            nextWallOppositeEnd = "start";
          } else if (
            nextWall.connections.start instanceof Corner &&
            nextWall.connections.start.uuid === corner.uuid
          ) {
            nextWallOppositeEnd = "end";
          }

          if (!nextWallOppositeEnd || !wallOppositeEnd) return;

          let currentNormal = wall[wallOppositeEnd]
            .clone()
            .sub(cornerPos)
            .normalize();
          let nextNormal = nextWall[nextWallOppositeEnd]
            .clone()
            ?.sub(cornerPos)
            .normalize();

          if (currentNormal && nextNormal) {
            let angle = angleBetweenVectorsWithOrientation(
              currentNormal,
              nextNormal
            );

            if (wallOppositeEnd === "end") {
              wall.endAngle = Math.PI / 2 - angle / 2;
            } else {
              wall.startAngle = Math.PI / 2 - angle / 2;
            }
          }
        });
      }
    });
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

import { Wall as WallModel, Corner } from "./../model/";
import { Scene as SceneController } from "../controller/Scene";
import { Room as RoomController } from "../controller/Room";
import { Drawing, Geometry, Math2D } from "../system";
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

  get corners() {
    return this.scene.model.objects.filter((obj): obj is Corner => {
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

    // console.log("");
    // console.log("corner", corner);
    // console.log("");

    if (corner) {
      corner.walls.push(newWall);
      newWall.connections.start = corner;
    } else if (closest && closest?.distance < 1) {
      this.connect(newWall, closest.object);
    }

    this.addObject(newWall);
    this.active = newWall;
  }

  end(pos: { x: number; y: number; z: number }) {
    if (!this.active) return;

    this.moveEnd(this.active, "end", { ...pos });

    const corner = this.active ? this.getClosestObject(this.active.end) : null;
    const closest = this.active ? this.getClosestWall(this.active.end) : null;

    if (this.active) {
      if (corner) {
        corner.walls.push(this.active);
        this.active.connections.end = corner;
      } else if (closest && closest?.distance < 0.5) {
        this.connect(this.active, closest.object);
      }
    }

    this.active = null;
  }

  moveEnd(
    wall: WallModel,
    end: "start" | "end",
    pos: { x: number; y: number; z: number }
  ) {
    wall[end].set(pos.x, pos.y, pos.z);
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

    const snapPosNet = Math2D.NetAlgorithms.netBind(
      new Vector3(snapPos.x, snapPos.y, snapPos.z)
    );

    let end = this.isItWallEnd(wallToConnect, snapPos);

    if (end) {
      let corner = new Corner({
        position: { ...snapPosNet },
      });

      corner.walls.push(wall);
      corner.walls.push(wallToConnect);

      wall.connections[intersection.end] = corner;
      wallToConnect.connections[end] = corner;

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
        start: wallToConnect.start.clone(),
        end: new Vector3(snapPosNet.x, snapPosNet.y, snapPosNet.z),
      });
      dividedWallFromPrevCorner.connections.start =
        wallToConnect.connections.start;
      dividedWallFromPrevCorner.connections.end = corner;

      let dividedWallToNextCorner = new WallModel({
        start: new Vector3(snapPosNet.x, snapPosNet.y, snapPosNet.z),
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

      this.scene.model.removeObject(wallToConnect.uuid);

      wallToConnect.destroy();

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

  startDraw(props: { x: number; y: number; z: number }) {
    if (this.active) {
      this.end({ ...props });
      this.start({ ...props });
    } else {
      this.start({ ...props });
    }

    this.updateGraph();
  }

  draw(props: { x: number; y: number; z: number }) {
    if (this.active) {
      this.moveEnd(this.active, "end", { ...props });
    }
  }

  private updateGraph() {
    this.roomController.graph.graph = {};
    this.roomController.graph.vertices = {};

    let walls = this.scene.model.objects.filter(
      (obj): obj is WallModel => obj instanceof WallModel
    );

    let corners = this.scene.model.objects.filter(
      (obj): obj is Corner => obj instanceof Corner
    );

    walls.map((wall) => {
      let from: Corner | undefined = corners.find((obj): obj is Corner =>
        obj.walls.some((w) => w.uuid === wall.uuid)
      );
      let to: Corner | undefined = corners.find(
        (obj): obj is Corner =>
          obj.walls.some((w) => w.uuid === wall.uuid) && obj.uuid !== from?.uuid
      );

      if (from && to) {
        this.roomController.graph?.addEdge(
          { uuid: from.uuid, position: from.position },
          { uuid: to.uuid, position: to.position }
        );
      }
    });

    if (!this.roomController.graph) return;

    let cycles = this.roomController.graph.getCycles();

    let roomCorners: Array<Array<Corner>> = [];

    cycles.map((cycle) => {
      let _corners: Array<Corner> = [];
      let vectors: Array<Vector3> = [];

      cycle.map((uuid) => {
        let corner: Corner | undefined = corners.find(
          (obj): obj is Corner => obj.uuid === uuid
        );

        if (corner) {
          _corners.push(corner);
          vectors.push(
            new Vector3(corner.position.x, corner.position.y, corner.position.z)
          );
        }
      });

      roomCorners.push(_corners);
    });

    this.roomController.updateByCorners(roomCorners);
  }

  private updateWallAngles() {
    // this.corners.map((corner, index, array) => {
    //   if (wall.connections.end instanceof Corner) {
    //     let nextWalls: WallModel[] = [];
    //
    //     let corner = wall.connections.end;
    //
    //     corner.walls.map((cornerWall) => {
    //       if (cornerWall.uuid !== wall.uuid) {
    //         nextWalls.push(cornerWall);
    //       }
    //     });
    //
    //     if (nextWalls.length === 1) {
    //       let nextWall = nextWalls[0];
    //       let oppositeAngle: "start" | "end" = nextWall.connections.end
    //         ? "start"
    //         : "end";
    //
    //       let current = wall.end.clone().sub(wall.start).normalize();
    //       let nextAngle = nextWall[oppositeAngle]
    //         .clone()
    //         .sub(nextWall[oppositeAngle === "start" ? "end" : "start"])
    //         .normalize();
    //
    //       // let angle = current.angleTo(nextAngle);
    //       let angle = angleBetweenVectorsWithOrientation(current, nextAngle);
    //
    //       // wall.startAngle = angle / 2;
    //       wall.endAngle = angle / 2;
    //       // nextWall.endAngle = angle / 2;
    //       // nextWall.startAngle = angle / 2;
    //     }
    //   }
    // });
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
            // wallOppositeEnd = wall.start.clone();
            wallOppositeEnd = "start";
          } else if (
            wall.connections.start instanceof Corner &&
            wall.connections.start.uuid === corner.uuid
          ) {
            // wallOppositeEnd = wall.end.clone();
            wallOppositeEnd = "end";
          }

          if (
            nextWall.connections.end instanceof Corner &&
            nextWall.connections.end.uuid === corner.uuid
          ) {
            // nextWallOppositeEnd = nextWall.start.clone();
            nextWallOppositeEnd = "start";
          } else if (
            nextWall.connections.start instanceof Corner &&
            nextWall.connections.start.uuid === corner.uuid
          ) {
            // nextWallOppositeEnd = nextWall.end.clone();
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
    if (this.active) {
      this.clearTempCorner();

      this.scene.model.removeObject(this.active.uuid);
      this.active?.destroy();
      this.active = null;
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

  // Calculate the angle in radians using atan2
  const angleRadians = Math.atan2(crossProduct, dotProduct);

  // Convert the angle to degrees
  const angleDegrees = angleRadians * (180 / Math.PI);

  return angleRadians;
}

export { Wall };

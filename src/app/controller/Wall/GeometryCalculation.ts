import { Vector3 } from "three";
import { Corner, WallEnd, Wall as WallModel } from "../../model";
import { Math2D } from "../../../system";

class GeometryCalculation {
  static getClosestCorner(vector: Vector3, corners: Corner[]) {
    corners.sort(
      (a, b) =>
        vector.distanceTo(
          new Vector3(a.position.x, a.position.y, a.position.z),
        ) -
        vector.distanceTo(
          new Vector3(b.position.x, b.position.y, b.position.z),
        ),
    );

    let closest: Corner | undefined = corners[0];

    return closest &&
      vector.distanceTo(
        new Vector3(closest.position.x, closest.position.y, closest.position.z),
      ) < 0.5
      ? closest
      : null;
  }

  static getClosestWall(
    wall: WallModel,
    vector: Vector3,
    walls: WallModel[],
  ): {
    distance: number;
    position: Vector3;
    object: WallModel;
  } | null {
    let snapsByDistance = Math2D.Line.seekSnap(walls, vector);

    let excludeItself = snapsByDistance.filter(
      (snap) => snap.object.uuid !== wall?.uuid,
    );

    return excludeItself[0] ?? null;
  }

  static getWallSnap(
    wall1: WallModel,
    wall2: WallModel,
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

  static angleBetweenVectorsWithOrientation(
    vectorA: Vector3,
    vectorB: Vector3,
  ) {
    const crossProduct = vectorA.x * vectorB.z - vectorA.z * vectorB.x;
    const dotProduct = vectorA.x * vectorB.x + vectorA.z * vectorB.z;

    return Math.atan2(crossProduct, dotProduct);
  }

  static isItWallEnd(wall: WallModel, pos: Vector3): WallEnd | null {
    let end = Math2D.Line.isEnd(wall, pos);
    return end ? (end === "start" ? wall.start : wall.end) : null;
  }
}

export { GeometryCalculation };

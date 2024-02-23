import { Geometry } from "./../";
import { Vector3 } from "three";
import { Corner, Wall as WallModel } from "../../model";

namespace Math2D {
  export class Line {
    static seekSnap<T extends Geometry.Line>(
      lines: Array<T>,
      vec: Geometry.Vector3,
    ) {
      let snaps: Array<{
        position: Geometry.Vector3;
        distance: number;
        isEnd: boolean;
        end: "start" | "end" | null;
        object: T;
      }> = [];

      lines.map((line) => {
        let pos = new Vector3(vec.x, vec.y, vec.z);
        let snap = this.getSnap(pos, line);

        if (snap) {
          let res = { ...snap, object: line };
          snaps.push(res);
        }
      });

      snaps.sort((a, b) => {
        if (a.distance < b.distance) return -1;
        return 0;
      });

      return snaps ?? null;
    }

    static getSnap<T extends Geometry.Line>(
      vec: Geometry.Vector3,
      line: Geometry.Line,
    ): {
      distance: number;
      position: Vector3;
      isEnd: boolean;
      end: "start" | "end" | null;
    } | null {
      let ret = null;

      let projection = this.vectorLineIntersectionPosition(vec, {
        start: line.start,
        end: line.end,
      });

      if (projection) {
        ret = {
          ...projection,
          isEnd: false,
          end: null,
        };
      } else {
        let end = this.isEnd(line, new Vector3(vec.x, vec.y, vec.z));

        if (end) {
          ret = {
            distance:
              end === "start"
                ? line.start.distanceTo(vec)
                : line.end.distanceTo(vec),
            position: end === "start" ? line.start.clone() : line.end.clone(),
            isEnd: true,
            end: end,
          };
        }
      }

      return ret ?? null;
    }

    private static getEnd<T extends Geometry.Line>(
      lines: Array<T>,
      end: Vector3,
    ): { object: T; end: "start" | "end" } | null {
      let closest: { object: T; end: "start" | "end" } | null = null;

      lines.find((line) => {
        if (line.end.distanceTo(end) < 1) {
          closest = { end: "end", object: line };
          return true;
        } else if (line.start.distanceTo(end) < 1) {
          closest = { end: "start", object: line };
          return true;
        }
      });

      return closest ?? null;
    }

    static isEnd(line: Geometry.Line, pos: Vector3): "start" | "end" | null {
      return line.end.distanceTo(pos) < 1
        ? "end"
        : line.start.distanceTo(pos) < 1
          ? "start"
          : null;
    }

    static isLine(obj: any): obj is Geometry.Line {
      return obj && "start" in obj;
    }

    private static vectorLineIntersectionPosition(
      v: Geometry.Vector3,
      ln: Geometry.Line,
    ): {
      distance: number;
      position: Vector3;
    } | null {
      let lnOrigin = ln.end.clone().sub(ln.start);
      let vOrigin = v.clone().sub(ln.start);

      let pos = lnOrigin
        .clone()
        .multiplyScalar(
          vOrigin.clone().dot(lnOrigin.clone()) /
            (lnOrigin.length() * lnOrigin.length()),
        );

      let isObtuse =
        vOrigin.clone().dot(lnOrigin) / (lnOrigin.length() * vOrigin.length()) <
        0;

      let isLonger = pos.length() > lnOrigin.length();

      if (isObtuse || isLonger) {
        return null;
      }

      return {
        distance: pos.clone().distanceTo(vOrigin),
        position: pos.add(ln.start),
      };
    }
  }

  export class NetAlgorithms {
    static netBind(pos: Vector3) {
      let ret = new Vector3();

      ret.x = +(pos.x / 10).toFixed(1) * 10;
      ret.z = +(pos.z / 10).toFixed(1) * 10;

      return ret;
    }

    static planeIntersection(height: THREE.Vector3, ray: THREE.Ray) {
      const { direction } = ray;

      let mag = direction.clone().length();
      let dot = direction.clone().dot(new Vector3(0, -1, 0)) / mag;
      let res = Math.acos(dot);
      // console.log('Math.cos(res)', Math.cos(res))
      let ln = ray.origin.clone().sub(height).y / Math.cos(res);

      const intersection = direction
        .clone()
        .multiplyScalar(ln)
        .add(ray.origin.clone());

      return new Vector3(
        intersection.x,
        Math.round(intersection.y),
        intersection.z,
      );
    }
  }

  export class Calculation {
    static calculateTheta(vector: Vector3): number {
      return Math.atan2(vector.z, vector.x) * (180 / Math.PI);
    }
  }
}

export { Math2D };

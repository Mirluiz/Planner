import { Geometry } from "./../";
import { Vector3 } from "three";
import { Corner } from "../../model";

namespace Math2D {
  export class Line {
    static seekSnap<T extends Geometry.Line>(
      lines: Array<T>,
      vec: Geometry.Vector3
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
      line: Geometry.Line
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
      end: Vector3
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
      ln: Geometry.Line
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
            (lnOrigin.length() * lnOrigin.length())
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
        intersection.z
      );
    }
  }

  export class Polygon {
    static earClipping(corners: Corner[]) {
      const n = corners.length;
      if (n < 3) {
        return;
      }

      const result: Geometry.Vector3[] = [];

      // Copy the vertices to avoid modifying the original array
      const remainingVertices = [
        ...corners.map(
          (corner) =>
            new Vector3(corner.position.x, corner.position.y, corner.position.z)
        ),
      ];

      while (remainingVertices.length > 2) {
        for (let i = 0; i < remainingVertices.length; i++) {
          const v0 = remainingVertices[i];
          const v1 = remainingVertices[(i + 1) % n];
          const v2 = remainingVertices[(i + 2) % n];

          if (this.isEar(v0, v1, v2, remainingVertices)) {
            // Found an ear, add triangle and remove ear vertex
            result.push(v0, v1, v2);
            remainingVertices.splice((i + 1) % n, 1);
            break; // Restart the loop
          }
        }
      }

      // Add the last triangle
      result.push(...remainingVertices);
      return result;
    }

    static isEar(
      v0: Vector3,
      v1: Vector3,
      v2: Vector3,
      vertices: Geometry.Vector3[]
    ): boolean {
      if (!v2) return false;
      // Check if the angle at v1 is concave
      const crossProduct =
        (v2.x - v1.x) * (v0.z - v1.z) - (v2.z - v1.z) * (v0.x - v1.x);
      if (crossProduct >= 0) {
        return false; // Convex angle, not an ear
      }

      // Check if any other vertex is inside the triangle v0-v1-v2
      for (const vertex of vertices) {
        if (
          vertex !== v0 &&
          vertex !== v1 &&
          vertex !== v2 &&
          this.pointInTriangle(v0, v1, v2, vertex)
        ) {
          return false; // Found a vertex inside the triangle, not an ear
        }
      }

      return true; // It's an ear
    }

    static pointInTriangle(
      v0: Vector3,
      v1: Vector3,
      v2: Vector3,
      p: Vector3
    ): boolean {
      const areaOriginal = Math.abs(
        (v1.x - v0.x) * (v2.z - v0.z) - (v2.x - v0.x) * (v1.z - v0.z)
      );
      const area1 = Math.abs(
        (p.x - v0.x) * (v1.z - v0.z) - (v1.x - v0.x) * (p.z - v0.z)
      );
      const area2 = Math.abs(
        (p.x - v1.x) * (v2.z - v1.z) - (v2.x - v1.x) * (p.z - v1.z)
      );
      const area3 = Math.abs(
        (p.x - v2.x) * (v0.z - v2.z) - (v0.x - v2.x) * (p.z - v2.z)
      );

      return Math.abs(area1 + area2 + area3 - areaOriginal) < 1e-6; // Use an epsilon to handle floating-point errors
    }
  }
}

export { Math2D };

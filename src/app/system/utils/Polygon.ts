import { Corner, Wall } from "../../model";
import { Graph, Vertex } from "./Graph";
import { Geometry } from "../interfaces";
import Vector3 = Geometry.Vector3;
import Line = Geometry.Line;

class Polygon {
  static connectInnerOuter(vertices: Vertex[], graph: Graph) {}
  static getVisiblePair(inner: Corner[], outer: Corner[]) {
    let pair: Corner | null = null;

    let maxRight = [...inner].sort((a, b) => a.position.x - b.position.x)[0];

    let intersectedWall: Wall | undefined;

    outer.map((corner) => {
      corner.walls.map((wall) => {
        let origin = new Vector3(
          maxRight.position.x,
          maxRight.position.y,
          maxRight.position.z
        );

        let intersect = this.intersect(
          { origin, direction: new Vector3(1, 0, 0) },
          wall
        );

        if (intersect) {
          intersectedWall = wall;
        }
      });
    });

    if (intersectedWall) {
      let maxRightOnWall =
        intersectedWall.start.x > intersectedWall.end.x
          ? intersectedWall.connections.start
          : intersectedWall.connections.end;

      if (maxRightOnWall instanceof Corner) {
        pair = maxRightOnWall;
      }
    }

    return pair;
  }

  private static intersect(
    ray: { origin: Vector3; direction: Vector3 },
    line: Line
  ): { position: Vector3; line: Line } | null {
    let { direction, origin } = ray;
    let lineDirection = line.end.clone().sub(line.start.clone()).normalize();

    const crossProduct =
      direction.x * lineDirection.z - direction.z * lineDirection.x;

    // Check if the lines are parallel
    if (crossProduct === 0) {
      return null; // No intersection (parallel lines)
    }

    const t =
      ((line.start.z - origin.z) * lineDirection.x -
        (line.start.x - origin.x) * lineDirection.z) /
      crossProduct;

    if (t >= 0) {
      // Intersection point
      return {
        position: new Vector3(
          ray.origin.x + t * ray.direction.x,
          0,
          ray.origin.z + t * ray.direction.z
        ),
        line,
      };
    } else {
      // No intersection along the ray
      return null;
    }
  }
}

export { Polygon };

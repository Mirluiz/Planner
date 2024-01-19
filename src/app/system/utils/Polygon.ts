import { Graph, Vertex } from "./Graph";
import { Geometry } from "../interfaces";
import Vector3 = Geometry.Vector3;
import Line = Geometry.Line;

class Polygon {
  static connectInnerOuter(vertices: Vertex[], graph: Graph) {}
  static getVisiblePair(inner: Vertex[], outer: Vertex[], graph: Graph) {
    let pair: Vertex | null = null;

    let maxRight = [...inner].sort((a, b) => b.pos.x - a.pos.x)[0];

    let intersectedWall:
      | (Line & { connections: { start: Vertex; end: Vertex } })
      | undefined;

    outer.map((vertex, index, array) => {
      if (intersectedWall) return;

      let nextVertex = array[(index + 1) % array.length];
      let line = {
        start: new Vector3(vertex.pos.x, 0, vertex.pos.y),
        end: new Vector3(nextVertex.pos.x, 0, nextVertex.pos.y),
        connections: { start: vertex, end: nextVertex },
      };
      let origin = new Vector3(maxRight.pos.x, 0, maxRight.pos.y);

      let intersect = this.intersect(
        { origin, direction: new Vector3(1, 0, 0) },
        line
      );

      if (intersect) {
        console.log("line", line);
        console.log("vertex", vertex);
        console.log("nextVertex", nextVertex);
        console.log("origin", origin);
        console.log("maxRight", maxRight);
        intersectedWall = line;
      }
    });

    if (intersectedWall) {
      let maxRightOnWall =
        intersectedWall.start.x > intersectedWall.end.x
          ? intersectedWall.connections.start
          : intersectedWall.connections.end;

      pair = maxRightOnWall;
    }

    return {
      maxRight,
      pair,
      intersectedWall: {
        start: intersectedWall?.connections.start,
        end: intersectedWall?.connections.end,
      },
    };
  }

  static intersect(
    ray: { origin: Vector3; direction: Vector3 },
    line: Line
  ): { position: Vector3; line: Line } | null {
    let { direction, origin } = ray;
    let lineDirection = line.end.clone().sub(line.start.clone()).normalize();
    let lineLn = line.end.clone().sub(line.start.clone()).length();

    const crossProduct =
      lineDirection.x * direction.z - lineDirection.z * direction.x;

    // Check if the lines are parallel
    if (crossProduct === 0) {
      return null; // No intersection (parallel lines)
    }

    const t =
      ((line.start.z - origin.z) * lineDirection.x -
        (line.start.x - origin.x) * lineDirection.z) /
      crossProduct;

    if (t >= 0 && t <= lineLn) {
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

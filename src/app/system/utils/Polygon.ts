import { Graph, Vertex } from "./Graph";
import { Geometry } from "../interfaces";
import Vector3 = Geometry.Vector3;
import Line = Geometry.Line;

class Polygon {
  static connectInnerOuter(inner: Vertex[], outer: Vertex[], graph: Graph) {
    let { pair, maxRight } = this.getVisiblePair(inner, outer, graph);

    if (pair) {
      let pairIndexInner = inner.findIndex((i) => i.val === maxRight?.val);
      let pairIndexOuter = outer.findIndex((i) => i.val === pair?.val);

      let innerFirstHalf = inner.slice(0, pairIndexInner);
      let innerSecondHalf = inner.slice(pairIndexInner);
      let sortedInnerByIndex = [...innerSecondHalf, ...innerFirstHalf]; //move paar inner index to start;

      let outerFirstHalf = outer.slice(0, pairIndexOuter);
      let outerSecondHalf = outer.slice(pairIndexOuter);

      return [
        ...outerFirstHalf,
        pair,
        ...sortedInnerByIndex,
        ...outerSecondHalf,
      ];
    }
  }
  static getVisiblePair(inner: Vertex[], outer: Vertex[], graph: Graph) {
    let pair: Vertex | null = null;
    let intersections: Array<{
      distance: number;
      line: Line & { connections: { start: Vertex; end: Vertex } };
    }> = [];

    let maxRight = [...inner].sort((a, b) => b.pos.x - a.pos.x)[0];
    let closestIntersectedLine:
      | (Line & { connections: { start: Vertex; end: Vertex } })
      | undefined;

    outer.map((vertex, index, array) => {
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
        intersections.push({ distance: intersect.distance, line: line });
      }
    });

    let shortest = intersections.sort((a, b) => a.distance - b.distance);
    closestIntersectedLine = shortest[0]?.line;

    if (closestIntersectedLine) {
      pair =
        closestIntersectedLine.start.x > closestIntersectedLine.end.x
          ? closestIntersectedLine.connections.start
          : closestIntersectedLine.connections.end;
    }

    return {
      maxRight,
      pair,
      intersectedLine: {
        start: closestIntersectedLine?.connections.start,
        end: closestIntersectedLine?.connections.end,
      },
    };
  }

  static intersect(
    ray: { origin: Vector3; direction: Vector3 },
    line: Line
  ): { position: Vector3; line: Line; distance: number } | null {
    let { direction, origin } = ray;
    let lineDirection = line.end.clone().sub(line.start.clone()).normalize();
    let lineLn = line.end.clone().sub(line.start.clone()).length();

    const crossProduct =
      lineDirection.x * direction.z - lineDirection.z * direction.x;

    if (crossProduct === 0) {
      return null;
    }

    const t =
      ((line.start.z - origin.z) * lineDirection.x -
        (line.start.x - origin.x) * lineDirection.z) /
      crossProduct;

    if (t >= 0 && t <= lineLn) {
      let intersectionPosition = new Vector3(
        ray.origin.x + t * ray.direction.x,
        0,
        ray.origin.z + t * ray.direction.z
      );

      let isIntersectionLefter =
        line.start.x < intersectionPosition.x &&
        line.end.x < intersectionPosition.x;
      let isIntersectionRighter =
        line.start.x > intersectionPosition.x &&
        line.end.x > intersectionPosition.x;

      let isIntersectionUpper =
        line.start.z < intersectionPosition.z &&
        line.end.z < intersectionPosition.z;
      let isIntersectionSmaller =
        line.start.z > intersectionPosition.z &&
        line.end.z > intersectionPosition.z;

      if (
        isIntersectionLefter ||
        isIntersectionRighter ||
        isIntersectionUpper ||
        isIntersectionSmaller
      ) {
        return null;
      } else {
        return {
          position: intersectionPosition,
          distance: t,
          line,
        };
      }
    } else {
      return null;
    }
  }
}

export { Polygon };

import { Graph, Vertex } from "../Graph";
import { Geometry } from "../../../app/Interfaces";
import { ConcavePolygon } from "./ConcavePolygon";
import Vector3 = Geometry.Vector3;
import Line = Geometry.Line;

class HolePolygon {
  private static connectInnerOuter(
    inner: Vertex[],
    outer: Vertex[],
    graph: Graph,
  ) {
    {
      let isCCL = ConcavePolygon.isCycleCounterclockwise(
        inner.map((i) => new Vector3(i.position.x, i.position.y, i.position.z)),
      );

      if (isCCL) {
        inner = inner.reverse();
      }
    }
    {
      let isCCL = ConcavePolygon.isCycleCounterclockwise(
        outer.map((i) => new Vector3(i.position.x, i.position.y, i.position.z)),
      );

      if (!isCCL) {
        outer = outer.reverse();
      }
    }

    let { pair, maxRight } = this.getVisiblePair(inner, outer, graph);

    if (pair) {
      let pairIndexInner = inner.findIndex((i) => i.uuid === maxRight?.uuid);
      let pairIndexOuter = outer.findIndex((i) => i.uuid === pair?.uuid);

      let innerFirstHalf = inner.slice(0, pairIndexInner);
      let innerSecondHalf = inner.slice(pairIndexInner);
      let sortedInnerByIndex = [...innerSecondHalf, ...innerFirstHalf]; //move paar inner index to start;

      let outerFirstHalf = outer.slice(0, pairIndexOuter);
      let outerSecondHalf = outer.slice(pairIndexOuter);

      return [
        ...outerFirstHalf,
        pair,
        ...sortedInnerByIndex,
        maxRight,
        ...outerSecondHalf,
      ];
    }
  }

  private static getVisiblePair(
    inner: Vertex[],
    outer: Vertex[],
    graph: Graph,
  ) {
    let pair: Vertex | null = null;
    let intersections: Array<{
      distance: number;
      line: Line & { connections: { start: Vertex; end: Vertex } };
    }> = [];

    let maxRight = [...inner].sort((a, b) => b.position.x - a.position.x)[0];
    let closestIntersectedLine:
      | (Line & { connections: { start: Vertex; end: Vertex } })
      | undefined;

    outer.map((vertex, index, array) => {
      let nextVertex = array[(index + 1) % array.length];
      let line = {
        start: new Vector3(
          vertex.position.x,
          vertex.position.y,
          vertex.position.z,
        ),
        end: new Vector3(
          nextVertex.position.x,
          nextVertex.position.y,
          nextVertex.position.z,
        ),
        connections: { start: vertex, end: nextVertex },
      };
      let origin = new Vector3(
        maxRight.position.x,
        maxRight.position.y,
        maxRight.position.z,
      );

      let intersect = this.intersect(
        { origin, direction: new Vector3(1, 0, 0) },
        line,
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

  //TODO: move to line
  private static intersect(
    ray: { origin: Vector3; direction: Vector3 },
    line: Line,
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
        ray.origin.z + t * ray.direction.z,
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

  static getTriangles(cycle: Array<Vertex>, graph: Graph): Vertex[] {
    let innerCycles = graph.getInnerCycles(cycle);

    let ret: Vertex[] | undefined;

    if (innerCycles && innerCycles[0].length >= 3) {
      let vertexCycle = graph.getVertexCycle(innerCycles[0]);

      let result = this.connectInnerOuter(vertexCycle, cycle, graph);

      if (result) {
        let res = ConcavePolygon.earClipping(result);

        ret = res;
      }
    }

    return ret ?? [];
  }
}

export { HolePolygon };

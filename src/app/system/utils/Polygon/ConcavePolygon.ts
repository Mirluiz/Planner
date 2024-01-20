import { Graph, Vertex } from "../Graph";
import { Geometry } from "../../interfaces";
import Vector3 = Geometry.Vector3;
import Line = Geometry.Line;
import { Corner } from "../../../model";

class ConcavePolygon {
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
          new Vector3(corner.position.x, corner.position.y, corner.position.z),
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
    vertices: Geometry.Vector3[],
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
    p: Vector3,
  ): boolean {
    const areaOriginal = Math.abs(
      (v1.x - v0.x) * (v2.z - v0.z) - (v2.x - v0.x) * (v1.z - v0.z),
    );
    const area1 = Math.abs(
      (p.x - v0.x) * (v1.z - v0.z) - (v1.x - v0.x) * (p.z - v0.z),
    );
    const area2 = Math.abs(
      (p.x - v1.x) * (v2.z - v1.z) - (v2.x - v1.x) * (p.z - v1.z),
    );
    const area3 = Math.abs(
      (p.x - v2.x) * (v0.z - v2.z) - (v0.x - v2.x) * (p.z - v2.z),
    );

    return Math.abs(area1 + area2 + area3 - areaOriginal) < 1e-6; // Use an epsilon to handle floating-point errors
  }

  private static calculateCrossProduct(
    v1: Vector3,
    v2: Vector3,
    v3: Vector3,
  ): number {
    const crossProduct =
      (v2.x - v1.x) * (v3.z - v1.z) - (v3.x - v1.x) * (v2.z - v1.z);
    return crossProduct;
  }

  static isCycleCounterclockwise(vertices: Vector3[]): boolean {
    const n = vertices.length;

    // Ensure there are at least three vertices
    if (n < 3) {
      console.error("A cycle must have at least three vertices.");
      return false;
    }

    let positiveCount = 0;
    let negativeCount = 0;

    for (let i = 0; i < n; i++) {
      const v1 = vertices[i];
      const v2 = vertices[(i + 1) % n];
      const v3 = vertices[(i + 2) % n];

      const crossProduct = this.calculateCrossProduct(v1, v2, v3);

      if (crossProduct > 0) {
        positiveCount++;
      } else if (crossProduct < 0) {
        negativeCount++;
      }
    }

    // If the majority of cross products are positive, the cycle is counterclockwise
    return positiveCount > negativeCount;
  }

  static cycleInner(cycle: string[], graph: Graph) {
    let vertexCycles = graph.getVertexCycle(cycle);

    let inner = graph.getInnerCycles(vertexCycles);
    return inner;
  }

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

  static intersect(
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
}

export { ConcavePolygon };

import { Graph, Vertex } from "../Graph";
import { Geometry } from "../../interfaces";
import Vector3 = Geometry.Vector3;
import Line = Geometry.Line;
import { Corner } from "../../../model";

class ConcavePolygon {
  static earClipping(vertices: Vertex[]): Vertex[] | undefined {
    const n = vertices.length;
    if (n < 3) {
      return;
    }

    const result: Vertex[] = [];

    const remainingVertices = [...vertices];

    let whileLimit = 4000;
    let limitCounter = 0;

    while (remainingVertices.length > 2 && limitCounter < whileLimit) {
      for (let i = 0; i < remainingVertices.length; i++) {
        const v0 = remainingVertices[i];
        const v1 = remainingVertices[(i + 1) % n];
        const v2 = remainingVertices[(i + 2) % n];

        if (v0 && v1 && v2 && this.isEar(v0, v1, v2, remainingVertices)) {
          result.push(v0, v1, v2);

          remainingVertices.splice((i + 1) % n, 1);
          break; // Restart the loop
        }
      }

      limitCounter++;
    }

    result.push(...remainingVertices);
    return result;
  }

  static isEar(
    v0: Vertex,
    v1: Vertex,
    v2: Vertex,
    vertices: Vertex[],
  ): boolean {
    if (!v2) return false;

    let voVector = new Vector3(v0.position.x, v0.position.y, v0.position.z);
    let v1Vector = new Vector3(v1.position.x, v1.position.y, v1.position.z);
    let v2Vector = new Vector3(v2.position.x, v2.position.y, v2.position.z);

    // Check if the angle at v1 is concave
    const crossProduct =
      (v2Vector.x - v1Vector.x) * (voVector.z - v1Vector.z) -
      (v2Vector.z - v1Vector.z) * (voVector.x - v1Vector.x);
    if (crossProduct >= 0) {
      return false; // Convex angle, not an ear
    }

    // Check if any other vertex is inside the triangle v0-v1-v2
    for (const vertex of vertices) {
      let res = this.pointInTriangle(
        voVector,
        v1Vector,
        v2Vector,
        new Vector3(vertex.position.x, vertex.position.y, vertex.position.z),
      );

      if (
        vertex.uuid !== v0.uuid &&
        vertex.uuid !== v1.uuid &&
        vertex.uuid !== v2.uuid &&
        res
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

  private static calculateCrossProduct(v1: Vector3, v2: Vector3): number {
    return (v2.x - v1.x) * (v2.z + v1.z);
  }

  static isCycleCounterclockwise(vertices: Vector3[]): boolean {
    const n = vertices.length;

    if (n < 3) {
      console.error("A cycle must have at least three vertices.");
      return false;
    }

    let res = 0;

    for (let i = 0; i < n; i++) {
      const v1 = vertices[i];
      const v2 = vertices[(i + 1) % n];

      const crossProduct = this.calculateCrossProduct(v1, v2);
      res += crossProduct;
    }

    return res > 0;
  }

  static getVisiblePair(inner: Vertex[], outer: Vertex[], graph: Graph) {
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
        start: new Vector3(vertex.position.x, 0, vertex.position.y),
        end: new Vector3(nextVertex.position.x, 0, nextVertex.position.y),
        connections: { start: vertex, end: nextVertex },
      };
      let origin = new Vector3(maxRight.position.x, 0, maxRight.position.y);

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

  static getTriangles(cycle: Array<Vertex>, graph: Graph): Vertex[] {
    {
      let isCCL = ConcavePolygon.isCycleCounterclockwise(
        cycle.map((i) => new Vector3(i.position.x, i.position.y, i.position.z)),
      );

      if (!isCCL) {
        cycle = cycle.reverse();
      }
    }

    let ret: Vertex[] | undefined = this.earClipping(cycle);

    return ret ?? [];
  }
}

export { ConcavePolygon };

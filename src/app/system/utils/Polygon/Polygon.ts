import { HolePolygon, ConcavePolygon, ConvexPolygon } from "./";
import { Graph, Vertex } from "../../../controller/Graph";
import { Vector3 } from "three";

class Polygon {
  static isConcave(cycle: Array<Vertex>): boolean {
    return !this.isConvex(cycle);
  }
  static isConvex(cycle: Array<Vertex>): boolean {
    const n = cycle.length;

    if (n < 3) {
      // A polygon with less than 3 vertices is not valid.
      return false;
    }

    let positiveCount = 0;
    let negativeCount = 0;

    for (let i = 0; i < n; i++) {
      const current = cycle[i];
      const next = cycle[(i + 1) % n];
      const prev = cycle[(i + n - 1) % n];

      const crossProduct = this.crossProductZ(prev, current, next);

      if (crossProduct > 0) {
        positiveCount++;
      } else if (crossProduct < 0) {
        negativeCount++;
      }

      // If both positive and negative cross products are encountered, the polygon is concave.
      if (positiveCount > 0 && negativeCount > 0) {
        return false;
      }
    }

    // If only positive or only negative cross products are encountered, the polygon is convex.
    return true;
  }

  static hasHole(cycle: Array<Vertex>, graph: Graph): boolean {
    let ret = false;
    let innerVertices: Vertex[] = [];

    Object.values(graph.vertices).map((ver) => {
      if (graph.isVertexInsideCycle(ver, cycle)) {
        let isVertexOnCycle = cycle.find((v) => v.uuid === ver.uuid);

        if (!isVertexOnCycle) {
          innerVertices.push(ver);
        }
      }
    });

    if (innerVertices.length > 2) {
      let innerCycle = graph.bfs(innerVertices[0], innerVertices[1]);

      const hasIntersections = cycle.filter((value) =>
        innerCycle.includes(value.uuid)
      );

      if (hasIntersections.length === 0) {
        ret = true;
      }
    }

    return ret;
  }

  static getTriangles(c: Array<Vertex>, graph: Graph): Vertex[] {
    let ret: Vertex[] = [];
    let cycle = [...c];

    {
      let isCCL = ConcavePolygon.isCycleCounterclockwise(
        cycle.map((i) => new Vector3(i.position.x, i.position.y, i.position.z))
      );

      if (!isCCL) {
        cycle = cycle.reverse();
      }
    }

    if (this.hasHole(cycle, graph)) {
      console.log("1");
      ret = HolePolygon.getTriangles(cycle, graph);
    } else if (this.isConcave(cycle)) {
      console.log("2");
      ret = ConcavePolygon.getTriangles(cycle, graph);
    } else if (this.isConvex(cycle)) {
      console.log("3");
      ret = ConvexPolygon.getTriangles(cycle);
    }

    return ret;
  }

  static crossProductZ(p1: Vertex, p2: Vertex, p3: Vertex): number {
    const vector1 = {
      x: p2.position.x - p1.position.x,
      y: p2.position.z - p1.position.z,
    };
    const vector2 = {
      x: p3.position.x - p2.position.x,
      y: p3.position.z - p2.position.z,
    };

    return vector1.x * vector2.y - vector1.y * vector2.x;
  }
}

export { Polygon };

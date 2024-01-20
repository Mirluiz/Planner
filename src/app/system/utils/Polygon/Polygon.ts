import { HolePolygon, ConcavePolygon, ConvexPolygon } from "./";
import { Graph, Vertex } from "../Graph";

class Polygon {
  static isConcave(cycle: Array<Vertex>): boolean {
    return false;
  }
  static isConvex(cycle: Array<Vertex>): boolean {
    return false;
  }
  static hasHole(cycle: Array<Vertex>): boolean {
    return false;
  }

  static getTriangles(cycle: Array<Vertex>, graph: Graph): Vertex[] {
    let ret: Vertex[] = [];

    if (this.hasHole(cycle)) {
      ret = HolePolygon.getTriangles(cycle, graph);
    } else if (this.isConcave(cycle)) {
      ret = ConcavePolygon.getTriangles(cycle, graph);
    } else if (this.isConvex(cycle)) {
      ret = ConvexPolygon.getTriangles(cycle, graph);
    }

    return ret;
  }
}

export { Polygon };

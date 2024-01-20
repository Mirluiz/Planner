import { HolePolygon, ConcavePolygon, ConvexPolygon } from "./";

class Polygon {
  hole: HolePolygon;
  concave: ConcavePolygon;
  convex: ConcavePolygon;

  constructor() {
    this.hole = new HolePolygon();
    this.concave = new ConcavePolygon();
    this.convex = new ConvexPolygon();
  }

  static isConcave(): boolean {
    return false;
  }
  static isConvex(): boolean {
    return false;
  }
  static hasHole(): boolean {
    return false;
  }
}

export { Polygon };

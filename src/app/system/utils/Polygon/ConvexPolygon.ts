import { Geometry } from "../../interfaces";
import Vector3 = Geometry.Vector3;
import { Vertex } from "../../../controller";

class ConvexPolygon {
  static getTriangles(vertices: Array<Vertex>): Vertex[] {
    let ret: Vertex[] = [];

    const n = vertices.length;
    if (n < 3) {
      console.info("polygon has vertices less than 3");
      return [];
    }

    // Copy the vertices to avoid modifying the original array
    const remainingVertices = [
      ...vertices.map((vertex) => {
        return {
          pos: new Vector3(vertex.position.x, 0, vertex.position.y),
          vertex,
        };
      }),
    ];

    const origin = remainingVertices[0];
    for (let i = 0; i < remainingVertices.length - 2; i++) {
      const v1 = remainingVertices[(i + 1) % n];
      const v2 = remainingVertices[(i + 2) % n];

      ret.push(...[origin.vertex, v1.vertex, v2.vertex]);
    }

    return ret;
  }
}

export { ConvexPolygon };

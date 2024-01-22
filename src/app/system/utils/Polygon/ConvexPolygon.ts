import { Geometry } from "../../interfaces";
import Vector3 = Geometry.Vector3;
import { Vertex } from "../../../controller";
import { ConcavePolygon } from "./ConcavePolygon";

class ConvexPolygon {
  static getTriangles(vS: Array<Vertex>): Vertex[] {
    let vertices = [...vS];
    {
      let isCCL = ConcavePolygon.isCycleCounterclockwise(
        vertices.map(
          (i) => new Vector3(i.position.x, i.position.y, i.position.z)
        )
      );

      if (!isCCL) {
        vertices = vertices.reverse();
      }
    }

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
          pos: new Vector3(
            vertex.position.x,
            vertex.position.y,
            vertex.position.z
          ),
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

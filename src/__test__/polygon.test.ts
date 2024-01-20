import { describe, test } from "@jest/globals";
import { Graph, Vertex } from "../app/system";
import { Polygon } from "../app/system/utils/Polygon/Polygon";

describe("Polygon", () => {
  /**

   0 ------------- 1
   |               |
   |    4 --- 5    |
   |    |     |    |
   |    7 --- 6    |
   |               |
   3 ------------- 2

   */

  test("Triangulation polygon case 1", () => {
    const ver0 = { uuid: "0", position: { x: 0, y: 0 } };
    const ver1 = { uuid: "1", position: { x: 4, y: 0 } };
    const ver2 = { uuid: "2", position: { x: 4, y: 4 } };
    const ver3 = { uuid: "3", position: { x: 0, y: 4 } };

    const ver4 = { uuid: "4", position: { x: 2, y: 2 } };
    const ver5 = { uuid: "5", position: { x: 3, y: 2 } };
    const ver6 = { uuid: "6", position: { x: 3, y: 3 } };
    const ver7 = { uuid: "7", position: { x: 2, y: 3 } };

    const graph = new Graph();
    graph.addEdge(ver0, ver1);
    graph.addEdge(ver1, ver2);
    graph.addEdge(ver2, ver3);
    graph.addEdge(ver3, ver0);

    graph.addEdge(ver4, ver5);
    graph.addEdge(ver5, ver6);
    graph.addEdge(ver6, ver7);
    graph.addEdge(ver7, ver4);

    let cycles = graph.getCycles();
    let res: Array<{ cycle: string[]; triangles: Vertex[] }> = [];

    cycles.map((cycle) => {
      let vertexCycle = graph.getVertexCycle(cycle);
      let inner = Polygon.getTriangles(vertexCycle, graph);

      res.push({ cycle, triangles: inner });
    });

    console.log("res", res);

    // console.log("res", res);
  });

  /**

   0 ----------------------- 1
   |                         |
   |    4 --- 5     8 --- 9  |
   |    |     |     |     |  |
   |    7 --- 6    11 --- 10 |
   |                         |
   3 ----------------------- 2

   */

  test("Triangulation polygon case 2", () => {
    const ver0 = { uuid: "0", position: { x: 0, y: 0 } };
    const ver1 = { uuid: "1", position: { x: 10, y: 0 } };
    const ver2 = { uuid: "2", position: { x: 10, y: 4 } };
    const ver3 = { uuid: "3", position: { x: 0, y: 4 } };

    const ver4 = { uuid: "4", position: { x: 2, y: 2 } };
    const ver5 = { uuid: "5", position: { x: 3, y: 2 } };
    const ver6 = { uuid: "6", position: { x: 3, y: 3 } };
    const ver7 = { uuid: "7", position: { x: 2, y: 3 } };

    const ver8 = { uuid: "8", position: { x: 4, y: 2 } };
    const ver9 = { uuid: "9", position: { x: 5, y: 2 } };
    const ver10 = { uuid: "10", position: { x: 5, y: 3 } };
    const ver11 = { uuid: "11", position: { x: 4, y: 3 } };

    const graph = new Graph();
    graph.addEdge(ver0, ver1);
    graph.addEdge(ver1, ver2);
    graph.addEdge(ver2, ver3);
    graph.addEdge(ver3, ver0);

    graph.addEdge(ver4, ver5);
    graph.addEdge(ver5, ver6);
    graph.addEdge(ver6, ver7);
    graph.addEdge(ver7, ver4);

    graph.addEdge(ver8, ver9);
    graph.addEdge(ver9, ver10);
    graph.addEdge(ver10, ver11);
    graph.addEdge(ver11, ver8);

    let cycles = graph.getCycles();

    // cycles.map((cycle) => {
    //   console.log("cycle", cycle);
    //   let inner = Polygon.getTriangles(cycle, graph);
    //   console.log("inner", inner);
    // });

    // let res = Polygon.cycleInner();
    // console.log("res", res);
  });
});

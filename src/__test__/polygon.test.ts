import { describe, test } from "@jest/globals";
import { Graph } from "../app/system";
import { Polygon } from "../app/system/utils/Polygon";

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
    const ver0 = { val: "0", pos: { x: 0, y: 0 } };
    const ver1 = { val: "1", pos: { x: 4, y: 0 } };
    const ver2 = { val: "2", pos: { x: 4, y: 4 } };
    const ver3 = { val: "3", pos: { x: 0, y: 4 } };

    const ver4 = { val: "4", pos: { x: 2, y: 2 } };
    const ver5 = { val: "5", pos: { x: 3, y: 2 } };
    const ver6 = { val: "6", pos: { x: 3, y: 3 } };
    const ver7 = { val: "7", pos: { x: 2, y: 3 } };

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

    cycles.map((cycle) => {
      let inner = Polygon.cycleInner(cycle, graph);
    });

    // let res = Polygon.cycleInner(outer, graph);
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
    const ver0 = { val: "0", pos: { x: 0, y: 0 } };
    const ver1 = { val: "1", pos: { x: 10, y: 0 } };
    const ver2 = { val: "2", pos: { x: 10, y: 4 } };
    const ver3 = { val: "3", pos: { x: 0, y: 4 } };

    const ver4 = { val: "4", pos: { x: 2, y: 2 } };
    const ver5 = { val: "5", pos: { x: 3, y: 2 } };
    const ver6 = { val: "6", pos: { x: 3, y: 3 } };
    const ver7 = { val: "7", pos: { x: 2, y: 3 } };

    const ver8 = { val: "8", pos: { x: 4, y: 2 } };
    const ver9 = { val: "9", pos: { x: 5, y: 2 } };
    const ver10 = { val: "10", pos: { x: 5, y: 3 } };
    const ver11 = { val: "11", pos: { x: 4, y: 3 } };

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

    cycles.map((cycle) => {
      console.log("cycle", cycle);
      let inner = Polygon.cycleInner(cycle, graph);
      console.log("inner", inner);
    });

    // let res = Polygon.cycleInner();
    // console.log("res", res);
  });
});

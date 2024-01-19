import { describe, expect, test } from "@jest/globals";
import { Graph } from "../app/system";

describe("Graph inner cycles", () => {
  /**

   0 -- 1
   |    | \
   |    |   \
   |    2 -- 3
   |         |
   6 -- 5 -- 4

   */
  test("2 room. have inner vertex", () => {
    const ver0 = { val: "0", pos: { x: 0, y: 0 } };
    const ver1 = { val: "1", pos: { x: 2, y: 0 } };
    const ver2 = { val: "2", pos: { x: 2, y: 2 } };
    const ver3 = { val: "3`", pos: { x: 4, y: 4 } };
    const ver4 = { val: "4", pos: { x: 4, y: 6 } };
    const ver5 = { val: "5", pos: { x: 2, y: 6 } };
    const ver6 = { val: "6", pos: { x: 0, y: 6 } };

    const graph = new Graph();
    graph.addEdge(ver0, ver1);
    graph.addEdge(ver1, ver2);
    graph.addEdge(ver2, ver3);
    graph.addEdge(ver1, ver3);
    graph.addEdge(ver3, ver4);
    graph.addEdge(ver4, ver5);
    graph.addEdge(ver5, ver6);
    graph.addEdge(ver6, ver0);

    let result = graph.getCycles();
    console.log("result", result);

    // expect(result.length).toBe(2);
    // expect(result[0]).toEqual([0, 1, 2, 3]);
    // expect(result[1]).toEqual([4, 5, 6]);
  });

  /**

   0 -- 1
   |    | \
   |    7  \
   |    |   \
   |    2 -- 3
   |         |
   6 -- 5 -- 4

   */
  test("2 room, inner vertices with more corners", () => {
    const ver0 = { val: "0", pos: { x: 0, y: 0 } };
    const ver1 = { val: "1", pos: { x: 2, y: 0 } };
    const ver2 = { val: "2", pos: { x: 2, y: 2 } };
    const ver3 = { val: "3", pos: { x: 4, y: 4 } };
    const ver4 = { val: "4", pos: { x: 4, y: 6 } };
    const ver5 = { val: "5", pos: { x: 2, y: 6 } };
    const ver6 = { val: "6", pos: { x: 0, y: 6 } };
    const ver7 = { val: "7", pos: { x: 0, y: 6 } };

    const graph = new Graph();
    graph.addEdge(ver0, ver1);
    graph.addEdge(ver1, ver7);
    graph.addEdge(ver7, ver2);
    graph.addEdge(ver2, ver3);
    graph.addEdge(ver1, ver3);
    graph.addEdge(ver3, ver4);
    graph.addEdge(ver4, ver5);
    graph.addEdge(ver5, ver6);
    graph.addEdge(ver6, ver0);

    let result = graph.getCycles();

    expect(result.length).toBe(2);
    expect(result[0]).toEqual(["3", "2", "7", "1", "0", "6", "5", "4"]);
    expect(result[1]).toEqual(["1", "7", "2", "3"]);
  });

  /**

   0 --- 1 ----- 4
   |    | \      |
   |    |  \     |
   |    |   \    |
   |    2 -- 3   |
   |             |
   7 -- 6 ------ 5

   */
  test("One outer room, one inner. has adj vertex", () => {
    const ver0 = { val: "0", pos: { x: 0, y: 0 } };
    const ver1 = { val: "1", pos: { x: 2, y: 0 } };
    const ver2 = { val: "2", pos: { x: 2, y: 2 } };
    const ver3 = { val: "3", pos: { x: 4, y: 2 } };
    const ver4 = { val: "4", pos: { x: 6, y: 0 } };
    const ver5 = { val: "5", pos: { x: 6, y: 6 } };
    const ver6 = { val: "6", pos: { x: 4, y: 6 } };
    const ver7 = { val: "7", pos: { x: 0, y: 6 } };

    const graph = new Graph();
    graph.addEdge(ver0, ver1);
    graph.addEdge(ver1, ver2);
    graph.addEdge(ver2, ver3);
    graph.addEdge(ver3, ver1);
    graph.addEdge(ver1, ver4);
    graph.addEdge(ver4, ver5);
    graph.addEdge(ver5, ver6);
    graph.addEdge(ver6, ver7);
    graph.addEdge(ver7, ver0);

    let result = graph.getCycles();

    console.log("result", result);
    expect(result.length).toBe(2);
    // expect(result[0]).toEqual(["1", "2", "3"]);
  });

  /**

   0 --- 1 --------------- 7
   |    | \                |
   |    |  4 --- 5         |
   |    |   \     \        |
   |    2 -- 3 --- 6       |
   |                       |
   10 -- 9 ---------------- 8

   */
  test("One outer, two inner rooms room. has adj vertex", () => {
    const ver0 = { val: "0", pos: { x: 0, y: 0 } };
    const ver1 = { val: "1", pos: { x: 2, y: 0 } };
    const ver2 = { val: "2", pos: { x: 2, y: 2 } };
    const ver3 = { val: "3", pos: { x: 4, y: 2 } };
    const ver4 = { val: "4", pos: { x: 3, y: 1 } };

    const ver5 = { val: "5", pos: { x: 6, y: 1 } };
    const ver6 = { val: "6", pos: { x: 7, y: 2 } };

    const ver7 = { val: "7", pos: { x: 8, y: 0 } };
    const ver8 = { val: "8", pos: { x: 8, y: 6 } };
    const ver9 = { val: "9", pos: { x: 2, y: 6 } };
    const ver10 = { val: "10", pos: { x: 0, y: 6 } };

    const graph = new Graph();
    graph.addEdge(ver0, ver1);
    graph.addEdge(ver1, ver2);
    graph.addEdge(ver2, ver3);
    graph.addEdge(ver3, ver4);
    graph.addEdge(ver4, ver1);
    graph.addEdge(ver4, ver5);
    graph.addEdge(ver5, ver6);
    graph.addEdge(ver6, ver3);
    graph.addEdge(ver1, ver7);
    graph.addEdge(ver7, ver8);
    graph.addEdge(ver8, ver9);
    graph.addEdge(ver9, ver10);
    graph.addEdge(ver10, ver0);

    let result = graph.getCycles();

    console.log("result", result);
  });

  /**

   0 ------------- 1
   |               |
   |    4 --- 5    |
   |    |     |    |
   |    7 --- 6    |
   |               |
   3 ------------- 2

   */
  test("One outer, two inner rooms room. not connected", () => {
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

    let result = graph.getCycles();

    console.log("result", result);
  });
});

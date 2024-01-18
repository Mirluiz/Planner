import { describe, expect, test } from "@jest/globals";
import { Graph } from "../app/system";

describe("Graph cycles", () => {
  /**
        0
       / \
      /   \
     3     1
      \   /
       \ /
        2
   */
  test("1 room", () => {
    const ver0 = { val: "0", pos: { x: 0, y: 0 } };
    const ver1 = { val: "1", pos: { x: 5, y: 4 } };
    const ver2 = { val: "2", pos: { x: 0, y: 8 } };
    const ver3 = { val: "3", pos: { x: -5, y: 4 } };

    const graph = new Graph();

    graph.addEdge(ver0, ver1);
    graph.addEdge(ver1, ver2);
    graph.addEdge(ver2, ver3);
    graph.addEdge(ver3, ver0);

    let result = graph.getCycles();

    expect(result.length).toBe(1);
    expect(result[0]).toEqual(["3", "2", "1", "0"]);
  });

  /**
        0
       / \
      /   \
     3 --- 1
      \   /
       \ /
        2
   */
  test("2 room", () => {
    const ver0 = { val: "0", pos: { x: 0, y: 0 } };
    const ver1 = { val: "1", pos: { x: 5, y: 4 } };
    const ver2 = { val: "2", pos: { x: 0, y: 8 } };
    const ver3 = { val: "3", pos: { x: -5, y: 4 } };

    const graph = new Graph();

    graph.addEdge(ver0, ver1);
    graph.addEdge(ver1, ver2);
    graph.addEdge(ver2, ver3);
    graph.addEdge(ver3, ver0);
    graph.addEdge(ver3, ver1);

    let result = graph.getCycles();

    expect(result.length).toBe(2);
    expect(result[0]).toEqual(["3", "1", "0"]);
    expect(result[1]).toEqual(["2", "3", "1"]);
  });

  /**
           0
         / | \
       /   |  \
     4 -- 5 -- 1
      \  / \  /
       \/   \/
       3 -- 2
   */
  test("5 room", () => {
    const ver0 = { val: "0", pos: { x: 0, y: 0 } };
    const ver1 = { val: "1", pos: { x: 6, y: 4 } };
    const ver2 = { val: "2", pos: { x: 4, y: 8 } };
    const ver3 = { val: "3", pos: { x: -4, y: 8 } };
    const ver4 = { val: "4", pos: { x: -6, y: 4 } };
    const ver5 = { val: "5", pos: { x: 0, y: 4 } };

    const graph = new Graph();
    graph.addEdge(ver0, ver1);
    graph.addEdge(ver1, ver2);
    graph.addEdge(ver2, ver3);
    graph.addEdge(ver3, ver4);
    graph.addEdge(ver4, ver0);

    graph.addEdge(ver0, ver5);
    graph.addEdge(ver1, ver5);
    graph.addEdge(ver2, ver5);
    graph.addEdge(ver3, ver5);
    graph.addEdge(ver4, ver5);

    const result = graph.getCycles();

    expect(result.length).toBe(5);

    expect(result[0]).toEqual(["5", "1", "0"]);
    expect(result[1]).toEqual(["5", "4", "0"]);
    expect(result[2]).toEqual(["2", "5", "1"]);
    expect(result[3]).toEqual(["5", "3", "2"]);
    expect(result[4]).toEqual(["4", "5", "3"]);
  });

  /**
              0
            /  \
           1     2
         /        \
        3----5---- 4
   */
  test("1 room with 6 edges", () => {
    const ver0 = { val: "0", pos: { x: 0, y: 0 } };
    const ver1 = { val: "1", pos: { x: -2, y: 2 } };
    const ver2 = { val: "2", pos: { x: 2, y: 2 } };
    const ver3 = { val: "3", pos: { x: -4, y: 4 } };
    const ver4 = { val: "4", pos: { x: -0, y: 4 } };
    const ver5 = { val: "5", pos: { x: 4, y: 4 } };

    const graph = new Graph();
    graph.addEdge(ver0, ver1);
    graph.addEdge(ver0, ver2);
    graph.addEdge(ver1, ver3);
    graph.addEdge(ver2, ver4);
    graph.addEdge(ver3, ver5);
    graph.addEdge(ver4, ver5);

    let result = graph.getCycles();

    expect(result.length).toBe(1);
    expect(result[0]).toEqual(["2", "4", "5", "3", "1", "0"]);
  });

  /**
            0
          /  \
         1 -- 2
       /       \
      3----5----4
   */
  test("2 room with 7 edges", () => {
    const ver0 = { val: "0", pos: { x: 0, y: 0 } };
    const ver1 = { val: "1", pos: { x: -2, y: 2 } };
    const ver2 = { val: "2", pos: { x: 2, y: 2 } };
    const ver3 = { val: "3", pos: { x: -4, y: 4 } };
    const ver4 = { val: "4", pos: { x: -0, y: 4 } };
    const ver5 = { val: "5", pos: { x: 4, y: 4 } };

    const graph = new Graph();
    graph.addEdge(ver0, ver1);
    graph.addEdge(ver0, ver2);
    graph.addEdge(ver1, ver2);
    graph.addEdge(ver1, ver3);
    graph.addEdge(ver2, ver4);
    graph.addEdge(ver3, ver5);
    graph.addEdge(ver4, ver5);

    let result = graph.getCycles();

    expect(result.length).toBe(2);
    expect(result[0]).toEqual(["2", "1", "0"]);
    expect(result[1]).toEqual(["2", "4", "5", "3", "1"]);
  });

  /**
          0
        /  \
      1 --- 2 ---- 3
   */
  test("1 room with orphan edge", () => {
    const ver0 = { val: "0", pos: { x: 0, y: 0 } };
    const ver1 = { val: "1", pos: { x: -2, y: 2 } };
    const ver2 = { val: "2", pos: { x: 2, y: 2 } };
    const ver3 = { val: "3", pos: { x: 4, y: 2 } };

    const graph = new Graph();
    graph.addEdge(ver0, ver1);
    graph.addEdge(ver0, ver2);
    graph.addEdge(ver1, ver2);
    graph.addEdge(ver2, ver3);

    let result = graph.getCycles();

    expect(result.length).toBe(1);
    expect(result[0]).toEqual(["2", "1", "0"]);
  });

  /**
        0
      /  \
    1 --- 2 --- 3
           \   /
            \ /
             4
   */
  test("2 room with 6 edges", () => {
    const ver0 = { val: "0", pos: { x: 0, y: 0 } };
    const ver1 = { val: "1", pos: { x: -2, y: 2 } };
    const ver2 = { val: "2", pos: { x: 2, y: 2 } };
    const ver3 = { val: "3", pos: { x: 6, y: 2 } };
    const ver4 = { val: "4", pos: { x: 4, y: 4 } };

    const graph = new Graph();
    graph.addEdge(ver0, ver1);
    graph.addEdge(ver0, ver2);
    graph.addEdge(ver1, ver2);
    graph.addEdge(ver2, ver3);
    graph.addEdge(ver2, ver4);
    graph.addEdge(ver3, ver4);

    let result = graph.getCycles();

    expect(result.length).toBe(2);
    expect(result[0]).toEqual(["2", "1", "0"]);
    expect(result[1]).toEqual(["4", "2", "3"]);
  });

  /**
      0 -- 1 -- 2 -- 3
      |    |    |    |
      |    |    |    |
      4 -- 5 -- 6 -- 7
   */
  test("3 room with 10 edges", () => {
    const ver0 = { val: "0", pos: { x: 0, y: 0 } };
    const ver1 = { val: "1", pos: { x: 2, y: 0 } };
    const ver2 = { val: "2", pos: { x: 4, y: 0 } };
    const ver3 = { val: "3", pos: { x: 6, y: 0 } };
    const ver4 = { val: "4", pos: { x: 0, y: 4 } };
    const ver5 = { val: "5", pos: { x: 2, y: 4 } };
    const ver6 = { val: "6", pos: { x: 4, y: 4 } };
    const ver7 = { val: "7", pos: { x: 8, y: 4 } };

    const graph = new Graph();
    graph.addEdge(ver0, ver1);
    graph.addEdge(ver1, ver2);
    graph.addEdge(ver2, ver3);
    graph.addEdge(ver3, ver7);
    graph.addEdge(ver7, ver6);
    graph.addEdge(ver6, ver5);
    graph.addEdge(ver5, ver4);
    graph.addEdge(ver4, ver0);

    graph.addEdge(ver1, ver5);
    graph.addEdge(ver2, ver6);

    let result = graph.getCycles();

    expect(result.length).toBe(3);
    expect(result[0]).toEqual(["4", "5", "1", "0"]);
    expect(result[1]).toEqual(["5", "6", "2", "1"]);
    expect(result[2]).toEqual(["6", "7", "3", "2"]);
  });

  /**

    0 -- 1    5
    |    |    | \
    |    |    |   \
    2 -- 3 -- 4 -- 6 -- 7

   */
  test("3 room with 9 edges", () => {
    const ver0 = { val: "0", pos: { x: 0, y: 0 } };
    const ver1 = { val: "1", pos: { x: 2, y: 0 } };
    const ver2 = { val: "2", pos: { x: 0, y: 4 } };
    const ver3 = { val: "3", pos: { x: 2, y: 4 } };
    const ver4 = { val: "4", pos: { x: 4, y: 4 } };
    const ver5 = { val: "5", pos: { x: 4, y: 0 } };
    const ver6 = { val: "6", pos: { x: 8, y: 4 } };
    const ver7 = { val: "7", pos: { x: 12, y: 4 } };

    const graph = new Graph();
    graph.addEdge(ver0, ver1);
    graph.addEdge(ver1, ver3);
    graph.addEdge(ver3, ver2);
    graph.addEdge(ver2, ver0);

    graph.addEdge(ver3, ver4);
    graph.addEdge(ver4, ver5);
    graph.addEdge(ver5, ver6);
    graph.addEdge(ver4, ver6);

    graph.addEdge(ver6, ver7);

    let result = graph.getCycles();

    expect(result.length).toBe(2);
    expect(result[0]).toEqual(["2", "3", "1", "0"]);
    expect(result[1]).toEqual(["6", "5", "4"]);
  });

  /**

     0 -- 1    6 -- 7
     |    |    |    |
     |    2 -- 5    |
     |    |    |    |
     4 -- 3    9 -- 8

   */
  test("2 room with 11 edges", () => {
    const ver0 = { val: "0", pos: { x: 0, y: 0 } };
    const ver1 = { val: "1", pos: { x: 2, y: 0 } };
    const ver2 = { val: "2", pos: { x: 2, y: 2 } };
    const ver3 = { val: "3", pos: { x: 2, y: 4 } };
    const ver4 = { val: "4", pos: { x: 0, y: 4 } };
    const ver5 = { val: "5", pos: { x: 6, y: 2 } };
    const ver6 = { val: "6", pos: { x: 6, y: 0 } };
    const ver7 = { val: "7", pos: { x: 8, y: 0 } };
    const ver8 = { val: "8", pos: { x: 8, y: 4 } };
    const ver9 = { val: "9", pos: { x: 6, y: 4 } };

    const graph = new Graph();
    graph.addEdge(ver0, ver1);
    graph.addEdge(ver1, ver2);
    graph.addEdge(ver2, ver3);
    graph.addEdge(ver3, ver4);
    graph.addEdge(ver4, ver0);

    graph.addEdge(ver6, ver7);
    graph.addEdge(ver7, ver8);
    graph.addEdge(ver8, ver9);
    graph.addEdge(ver9, ver5);
    graph.addEdge(ver5, ver6);

    graph.addEdge(ver2, ver5);

    let result = graph.getCycles();

    expect(result.length).toBe(2);
    // expect(result[0]).toEqual([0, 1, 2, 3]);
    // expect(result[1]).toEqual([4, 5, 6]);
  });

  /**

   0 ----------- 1
   |             |
   |             |
   |        3 -- 2
   |        |    |
   5 ------ 4    |
   |        |    |
   |        8 -- 9
   |        |    |
   6 ------ 7 -- 10
   */
  test("4 room with 13 edges", () => {
    const ver0 = { val: "0", pos: { x: 0, y: 0 } };
    const ver1 = { val: "1", pos: { x: 10, y: 0 } };
    const ver2 = { val: "2", pos: { x: 10, y: 4 } };
    const ver3 = { val: "3", pos: { x: 8, y: 4 } };
    const ver4 = { val: "4", pos: { x: 8, y: 5 } };
    const ver5 = { val: "5", pos: { x: 0, y: 5 } };
    const ver6 = { val: "6", pos: { x: 0, y: 10 } };
    const ver7 = { val: "7", pos: { x: 8, y: 10 } };
    const ver8 = { val: "8", pos: { x: 8, y: 7 } };
    const ver9 = { val: "9", pos: { x: 10, y: 7 } };
    const ver10 = { val: "10", pos: { x: 10, y: 10 } };

    const graph = new Graph();
    graph.addEdge(ver0, ver1);
    graph.addEdge(ver1, ver2);
    graph.addEdge(ver2, ver3);
    graph.addEdge(ver3, ver4);
    graph.addEdge(ver4, ver5);
    graph.addEdge(ver0, ver5);

    graph.addEdge(ver4, ver8);
    graph.addEdge(ver8, ver7);
    graph.addEdge(ver7, ver6);
    graph.addEdge(ver6, ver5);

    graph.addEdge(ver8, ver9);
    graph.addEdge(ver9, ver2);

    graph.addEdge(ver9, ver10);
    graph.addEdge(ver10, ver7);

    let result = graph.getCycles();

    expect(result.length).toBe(4);
    expect(result[0]).toEqual(["5", "4", "3", "2", "1", "0"]);
    expect(result[1]).toEqual(["9", "8", "4", "3", "2"]);
    expect(result[2]).toEqual(["8", "4", "5", "6", "7"]);
    expect(result[3]).toEqual(["10", "9", "8", "7"]);
  });
});

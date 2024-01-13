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
    expect(result[0]).toEqual(["0", "1", "2", "3"]);
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
    expect(result[0]).toEqual(["0", "1", "3"]);
    expect(result[1]).toEqual(["1", "2", "3"]);
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

    expect(result[0]).toEqual(["0", "1", "5"]);
    expect(result[1]).toEqual(["0", "4", "5"]);
    expect(result[2]).toEqual(["1", "2", "5"]);
    expect(result[3]).toEqual(["2", "3", "5"]);
    expect(result[4]).toEqual(["3", "4", "5"]);
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
    expect(result[0]).toEqual(["0", "1", "2", "3", "4", "5"]);
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
    expect(result[0]).toEqual(["0", "1", "2"]);
    expect(result[1]).toEqual(["1", "2", "3", "4", "5"]);
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
    expect(result[0]).toEqual(["0", "1", "2"]);
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
    expect(result[0]).toEqual(["0", "1", "2"]);
    expect(result[1]).toEqual(["2", "3", "4"]);
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
    expect(result[0]).toEqual(["0", "1", "4", "5"]);
    expect(result[1]).toEqual(["1", "2", "5", "6"]);
    expect(result[2]).toEqual(["2", "3", "6", "7"]);
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
    expect(result[0]).toEqual(["0", "1", "2", "3"]);
    expect(result[1]).toEqual(["4", "5", "6"]);
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
    expect(result[0]).toEqual(["0", "1", "2", "3", "4", "5"]);
    expect(result[1]).toEqual(["2", "3", "4", "8", "9"]);
    expect(result[2]).toEqual(["4", "5", "6", "7", "8"]);
    expect(result[3]).toEqual(["10", "7", "8", "9"]);
  });

  /**

    0 ----- 5 ---- 6 --- 8 ----- 9--------- 16 --------- 17 -- 19
    |       |            |      /|         /  \          |    /
    |   3   |            |    /  |        /    \         |   /
    |  / \  |            |  /    28     27 ---- 26       |  /
    | 4   \ |            | /    /  \                     | /
    |      \|            |/    30--29                    |/
    1 ----- 2            7 ----------------------------- 18 -------- 22
                  12                                      |           |
                /   \            14                       |    25     |
               /     \         /   \                      |  /   \    |
              10 --- 11      /      \                     | 23 -- 24  |
                           13        15                   |/          |
                                                         20 -------- 21

   */
  test("example from book", () => {
    const ver0 = { val: "0", pos: { x: 0, y: 0 } };
    const ver1 = { val: "1", pos: { x: 0, y: 10 } };
    const ver2 = { val: "2", pos: { x: 10, y: 10 } };
    const ver3 = { val: "3", pos: { x: 5, y: 5 } };
    const ver4 = { val: "4", pos: { x: 3, y: 8 } };
    const ver5 = { val: "5", pos: { x: 10, y: 0 } };

    const ver6 = { val: "6", pos: { x: 15, y: 0 } };

    const ver8 = { val: "7", pos: { x: 20, y: 10 } };
    const ver7 = { val: "8", pos: { x: 20, y: 0 } };
    const ver9 = { val: "9", pos: { x: 30, y: 0 } };

    const ver10 = { val: "10", pos: { x: 10, y: 15 } };
    const ver11 = { val: "11", pos: { x: 15, y: 10 } };
    const ver12 = { val: "12", pos: { x: 20, y: 15 } };

    const ver13 = { val: "13", pos: { x: 20, y: 20 } };
    const ver14 = { val: "14", pos: { x: 30, y: 17 } };
    const ver15 = { val: "15", pos: { x: 35, y: 15 } };

    const ver16 = { val: "16", pos: { x: 40, y: 0 } };
    const ver17 = { val: "17", pos: { x: 50, y: 0 } };
    const ver18 = { val: "18", pos: { x: 50, y: 10 } };
    const ver19 = { val: "19", pos: { x: 60, y: 0 } };

    const ver20 = { val: "20", pos: { x: 50, y: 20 } };
    const ver21 = { val: "21", pos: { x: 60, y: 20 } };
    const ver22 = { val: "22", pos: { x: 60, y: 10 } };

    const ver23 = { val: "23", pos: { x: 52, y: 18 } };
    const ver24 = { val: "24", pos: { x: 58, y: 18 } };
    const ver25 = { val: "25", pos: { x: 55, y: 15 } };

    const ver26 = { val: "26", pos: { x: 45, y: 5 } };
    const ver27 = { val: "27", pos: { x: 35, y: 5 } };

    const ver28 = { val: "28", pos: { x: 30, y: 5 } };
    const ver29 = { val: "29", pos: { x: 35, y: 8 } };
    const ver30 = { val: "30", pos: { x: 25, y: 8 } };

    const graph = new Graph();

    graph.addEdge(ver0, ver1);
    graph.addEdge(ver1, ver2);
    graph.addEdge(ver2, ver3);
    graph.addEdge(ver3, ver4);
    graph.addEdge(ver0, ver5);

    graph.addEdge(ver2, ver5);
    graph.addEdge(ver5, ver6);
    graph.addEdge(ver6, ver8);
    graph.addEdge(ver8, ver7);
    graph.addEdge(ver8, ver9);
    graph.addEdge(ver9, ver16);

    graph.addEdge(ver10, ver11);
    graph.addEdge(ver11, ver12);
    graph.addEdge(ver12, ver10);

    graph.addEdge(ver13, ver14);
    graph.addEdge(ver14, ver15);

    graph.addEdge(ver16, ver27);
    graph.addEdge(ver27, ver26);
    graph.addEdge(ver26, ver16);
    graph.addEdge(ver16, ver17);

    graph.addEdge(ver17, ver18);
    graph.addEdge(ver18, ver19);
    graph.addEdge(ver19, ver17);
    graph.addEdge(ver7, ver18);

    graph.addEdge(ver18, ver22);
    graph.addEdge(ver22, ver21);
    graph.addEdge(ver21, ver20);
    graph.addEdge(ver20, ver18);

    graph.addEdge(ver20, ver23);
    graph.addEdge(ver23, ver24);
    graph.addEdge(ver24, ver25);
    graph.addEdge(ver25, ver23);

    graph.addEdge(ver9, ver7);
    graph.addEdge(ver9, ver28);
    graph.addEdge(ver28, ver29);
    graph.addEdge(ver29, ver30);
    graph.addEdge(ver30, ver28);

    let result = graph.getCycles();

    expect(result.length).toBe(9);
  });
});

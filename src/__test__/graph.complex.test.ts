import { describe, expect, test } from "@jest/globals";
import { Graph } from "../app/system";

describe("Graph cycles", () => {
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
    console.log("result", result);

    // expect(result.length).toBe(9);
  });
});

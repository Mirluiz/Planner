import { describe, expect, test } from "@jest/globals";
import { Graph } from "../../system";

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
    const ver0 = { uuid: "0", position: { x: 0, y: 0 } };
    const ver1 = { uuid: "1", position: { x: 0, y: 10 } };
    const ver2 = { uuid: "2", position: { x: 10, y: 10 } };
    const ver3 = { uuid: "3", position: { x: 5, y: 5 } };
    const ver4 = { uuid: "4", position: { x: 3, y: 8 } };
    const ver5 = { uuid: "5", position: { x: 10, y: 0 } };

    const ver6 = { uuid: "6", position: { x: 15, y: 0 } };

    const ver8 = { uuid: "7", position: { x: 20, y: 10 } };
    const ver7 = { uuid: "8", position: { x: 20, y: 0 } };
    const ver9 = { uuid: "9", position: { x: 30, y: 0 } };

    const ver10 = { uuid: "10", position: { x: 10, y: 15 } };
    const ver11 = { uuid: "11", position: { x: 15, y: 10 } };
    const ver12 = { uuid: "12", position: { x: 20, y: 15 } };

    const ver13 = { uuid: "13", position: { x: 20, y: 20 } };
    const ver14 = { uuid: "14", position: { x: 30, y: 17 } };
    const ver15 = { uuid: "15", position: { x: 35, y: 15 } };

    const ver16 = { uuid: "16", position: { x: 40, y: 0 } };
    const ver17 = { uuid: "17", position: { x: 50, y: 0 } };
    const ver18 = { uuid: "18", position: { x: 50, y: 10 } };
    const ver19 = { uuid: "19", position: { x: 60, y: 0 } };

    const ver20 = { uuid: "20", position: { x: 50, y: 20 } };
    const ver21 = { uuid: "21", position: { x: 60, y: 20 } };
    const ver22 = { uuid: "22", position: { x: 60, y: 10 } };

    const ver23 = { uuid: "23", position: { x: 52, y: 18 } };
    const ver24 = { uuid: "24", position: { x: 58, y: 18 } };
    const ver25 = { uuid: "25", position: { x: 55, y: 15 } };

    const ver26 = { uuid: "26", position: { x: 45, y: 5 } };
    const ver27 = { uuid: "27", position: { x: 35, y: 5 } };

    const ver28 = { uuid: "28", position: { x: 30, y: 5 } };
    const ver29 = { uuid: "29", position: { x: 35, y: 8 } };
    const ver30 = { uuid: "30", position: { x: 25, y: 8 } };

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

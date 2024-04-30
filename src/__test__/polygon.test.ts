import { describe, test } from "@jest/globals";
import { Graph, Vertex } from "../system/utils/Graph";
import { Polygon } from "../system/utils/Polygon/Polygon";
import { Vector3 } from "three";
import { ConcavePolygon } from "../system/utils/Polygon";

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
  test("Polygon has hole", () => {
    const ver0 = { uuid: "0", position: { x: 0, y: 0, z: 0 } };
    const ver1 = { uuid: "1", position: { x: 4, y: 0, z: 0 } };
    const ver2 = { uuid: "2", position: { x: 4, y: 0, z: 4 } };
    const ver3 = { uuid: "3", position: { x: 0, y: 0, z: 4 } };

    const ver4 = { uuid: "4", position: { x: 2, y: 0, z: 2 } };
    const ver5 = { uuid: "5", position: { x: 3, y: 0, z: 2 } };
    const ver6 = { uuid: "6", position: { x: 3, y: 0, z: 3 } };
    const ver7 = { uuid: "7", position: { x: 2, y: 0, z: 3 } };

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

    let vertexCycle = graph.getVertexCycle(cycles[0]);
    let hasHole = Polygon.hasHole(vertexCycle, graph);
    let isConvex = Polygon.isConvex(vertexCycle);
    let isConcave = Polygon.isConcave(vertexCycle);

    expect(hasHole).toBe(true);
    expect(isConvex).toBe(true);
    expect(isConcave).toBe(false);
  });

  /**

   0 ------------- 1
   |               |
   |               |
   |               |
   |               |
   |               |
   3 ------------- 2

   */
  test("Polygon is convex", () => {
    const ver0 = { uuid: "0", position: { x: 0, y: 0, z: 0 } };
    const ver1 = { uuid: "1", position: { x: 4, y: 0, z: 0 } };
    const ver2 = { uuid: "2", position: { x: 4, y: 0, z: 4 } };
    const ver3 = { uuid: "3", position: { x: 0, y: 0, z: 4 } };

    const graph = new Graph();
    graph.addEdge(ver0, ver1);
    graph.addEdge(ver1, ver2);
    graph.addEdge(ver2, ver3);
    graph.addEdge(ver3, ver0);

    let cycles = graph.getCycles();

    let vertexCycle = graph.getVertexCycle(cycles[0]);
    let hasHole = Polygon.hasHole(vertexCycle, graph);
    let isConvex = Polygon.isConvex(vertexCycle);
    let isConcave = Polygon.isConcave(vertexCycle);

    expect(hasHole).toBe(false);
    expect(isConvex).toBe(true);
    expect(isConcave).toBe(false);
  });

  /**

           0 ----- 1
           |       |
           |       |
   4 ----- 5       |
   |               |
   |               |
   3 ------------- 2

   */
  test("Polygon is concave", () => {
    const ver0 = { uuid: "0", position: { x: 4, y: 0, z: 0 } };
    const ver1 = { uuid: "1", position: { x: 8, y: 0, z: 0 } };
    const ver2 = { uuid: "2", position: { x: 8, y: 0, z: 4 } };
    const ver3 = { uuid: "3", position: { x: 0, y: 0, z: 4 } };
    const ver4 = { uuid: "4", position: { x: 0, y: 0, z: 2 } };
    const ver5 = { uuid: "5", position: { x: 4, y: 0, z: 2 } };

    const graph = new Graph();
    graph.addEdge(ver0, ver1);
    graph.addEdge(ver1, ver2);
    graph.addEdge(ver2, ver3);
    graph.addEdge(ver3, ver4);
    graph.addEdge(ver4, ver5);
    graph.addEdge(ver5, ver0);

    let cycles = graph.getCycles();

    let vertexCycle = graph.getVertexCycle(cycles[0]);
    let hasHole = Polygon.hasHole(vertexCycle, graph);
    let isConvex = Polygon.isConvex(vertexCycle);
    let isConcave = Polygon.isConcave(vertexCycle);

    expect(hasHole).toBe(false);
    expect(isConvex).toBe(false);
    expect(isConcave).toBe(true);
  });
});

describe("Polygon triangulation", () => {
  /**

   0 ------------- 1
   |               |
   |               |
   |               |
   |               |
   |               |
   3 ------------- 2

   */
  test("Polygon triangulation case 1", () => {
    const ver0 = { uuid: "0", position: { x: 0, y: 0, z: 0 } };
    const ver1 = { uuid: "1", position: { x: 4, y: 0, z: 0 } };
    const ver2 = { uuid: "2", position: { x: 4, y: 0, z: 4 } };
    const ver3 = { uuid: "3", position: { x: 0, y: 0, z: 4 } };

    const graph = new Graph();
    graph.addEdge(ver0, ver1);
    graph.addEdge(ver1, ver2);
    graph.addEdge(ver2, ver3);
    graph.addEdge(ver3, ver0);

    let cycles = graph.getCycles();

    let vertexCycle = graph.getVertexCycle(cycles[0]);
    let triangles = Polygon.getTriangles(vertexCycle, graph);

    console.log("triangles", triangles);
    // expect(triangles).toStrictEqual(['0', '1'])
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
    const ver0 = { uuid: "0", position: { x: 0, y: 0, z: 0 } };
    const ver1 = { uuid: "1", position: { x: 10, y: 0, z: 0 } };
    const ver2 = { uuid: "2", position: { x: 10, y: 0, z: 4 } };
    const ver3 = { uuid: "3", position: { x: 0, y: 0, z: 4 } };

    const ver4 = { uuid: "4", position: { x: 2, y: 0, z: 2 } };
    const ver5 = { uuid: "5", position: { x: 3, y: 0, z: 2 } };
    const ver6 = { uuid: "6", position: { x: 3, y: 0, z: 3 } };
    const ver7 = { uuid: "7", position: { x: 2, y: 0, z: 3 } };

    const ver8 = { uuid: "8", position: { x: 4, y: 0, z: 2 } };
    const ver9 = { uuid: "9", position: { x: 5, y: 0, z: 2 } };
    const ver10 = { uuid: "10", position: { x: 5, y: 0, z: 3 } };
    const ver11 = { uuid: "11", position: { x: 4, y: 0, z: 3 } };

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

  /**

   0 ------------- 1
   |               |
   |    4 --- 5    |
   |    |     |    |
   |    7 --- 6    |
   |               |
   3 ------------- 2

   */
  test("Triangulation polygon case 3", () => {
    const ver0 = { uuid: "0", position: { x: 0, y: 0, z: 0 } };
    const ver1 = { uuid: "1", position: { x: 4, y: 0, z: 0 } };
    const ver2 = { uuid: "2", position: { x: 5, y: 0, z: 4 } };
    const ver3 = { uuid: "3", position: { x: 0, y: 0, z: 4 } };

    const ver4 = { uuid: "4", position: { x: 2, y: 0, z: 2 } };
    const ver5 = { uuid: "5", position: { x: 3, y: 0, z: 2 } };
    const ver6 = { uuid: "6", position: { x: 3, y: 0, z: 3 } };
    const ver7 = { uuid: "7", position: { x: 2, y: 0, z: 3 } };

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

    let vertexCycle = graph.getVertexCycle(cycles[0]);

    let triangles = Polygon.getTriangles(vertexCycle, graph);
    //
    // console.log("triangles", triangles);
  });

  /**

           0 ----- 1
           |       |
           |       |
   4 ----- 5       |
   |               |
   |               |
   3 ------------- 2

   */
  test("Triangulation polygon case 4", () => {
    const ver0 = { uuid: "0", position: { x: 4, y: 0, z: 0 } };
    const ver1 = { uuid: "1", position: { x: 8, y: 0, z: 0 } };
    const ver2 = { uuid: "2", position: { x: 8, y: 0, z: 4 } };
    const ver3 = { uuid: "3", position: { x: 0, y: 0, z: 4 } };
    const ver4 = { uuid: "4", position: { x: 0, y: 0, z: 2 } };
    const ver5 = { uuid: "5", position: { x: 4, y: 0, z: 2 } };

    const graph = new Graph();
    graph.addEdge(ver0, ver1);
    graph.addEdge(ver1, ver2);
    graph.addEdge(ver2, ver3);
    graph.addEdge(ver3, ver4);
    graph.addEdge(ver4, ver5);
    graph.addEdge(ver5, ver0);

    let cycles = graph.getCycles();

    let vertexCycle = graph.getVertexCycle(cycles[0]);
    let triangulation = Polygon.getTriangles(vertexCycle, graph);
  });

  /**

   1 ------------- 0
   |               |
   |    4 --- 5    |
   |    |     |    |
   |    7 --- 6    |
   |               |
   2 ------------- 3

   */
  test("Triangulation polygon case 5", () => {
    const ver0 = { uuid: "0", position: { x: 5, y: 0, z: 0 } };
    const ver1 = { uuid: "1", position: { x: 0, y: 0, z: 0 } };
    const ver2 = { uuid: "2", position: { x: 0, y: 0, z: 4 } };
    const ver3 = { uuid: "3", position: { x: 4, y: 0, z: 4 } };

    const ver4 = { uuid: "4", position: { x: 2, y: 0, z: 2 } };
    const ver5 = { uuid: "5", position: { x: 3, y: 0, z: 2 } };
    const ver6 = { uuid: "6", position: { x: 3, y: 0, z: 3 } };
    const ver7 = { uuid: "7", position: { x: 2, y: 0, z: 3 } };

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

    let vertexCycle = graph.getVertexCycle(cycles[0]);

    let triangles = Polygon.getTriangles(vertexCycle, graph);

    console.log("triangles", triangles);
  });

  /**

   2 ----- 1 -------- 0
   |       |          |
   |       5          |
   |     /  \         |
   |    6 -- 7        |
   |                  |
   3 ---------------- 4

   */
  test("Triangulation polygon case 6", () => {
    const ver0 = { uuid: "0", position: { x: 10, y: 0, z: 0 } };
    const ver1 = { uuid: "1", position: { x: 5, y: 0, z: 0 } };
    const ver2 = { uuid: "2", position: { x: 0, y: 0, z: 0 } };
    const ver3 = { uuid: "3", position: { x: 0, y: 0, z: 10 } };
    const ver4 = { uuid: "4", position: { x: 10, y: 0, z: 10 } };

    const ver5 = { uuid: "5", position: { x: 5, y: 0, z: 3 } };
    const ver6 = { uuid: "6", position: { x: 3, y: 0, z: 7 } };
    const ver7 = { uuid: "7", position: { x: 8, y: 0, z: 7 } };

    const graph = new Graph();
    graph.addEdge(ver0, ver1);
    graph.addEdge(ver1, ver2);
    graph.addEdge(ver2, ver3);
    graph.addEdge(ver3, ver4);
    graph.addEdge(ver4, ver0);

    graph.addEdge(ver1, ver5);
    graph.addEdge(ver5, ver6);
    graph.addEdge(ver6, ver7);
    graph.addEdge(ver7, ver5);

    let cycles = graph.getCycles();
    let vertexCycle = graph.getVertexCycle(cycles[0]);

    let triangles = Polygon.getTriangles(vertexCycle, graph);

    expect(cycles.length).toBe(2);
    expect(triangles).toStrictEqual([
      { uuid: "5", position: { x: 5, y: 0, z: 3 }, isVertex: true },
      { uuid: "7", position: { x: 8, y: 0, z: 7 }, isVertex: true },
      { uuid: "0", position: { x: 10, y: 0, z: 0 }, isVertex: true },
      { uuid: "5", position: { x: 5, y: 0, z: 3 }, isVertex: true },
      { uuid: "0", position: { x: 10, y: 0, z: 0 }, isVertex: true },
      { uuid: "1", position: { x: 5, y: 0, z: 0 }, isVertex: true },
      { uuid: "6", position: { x: 3, y: 0, z: 7 }, isVertex: true },
      { uuid: "5", position: { x: 5, y: 0, z: 3 }, isVertex: true },
      { uuid: "1", position: { x: 5, y: 0, z: 0 }, isVertex: true },
      { uuid: "6", position: { x: 3, y: 0, z: 7 }, isVertex: true },
      { uuid: "1", position: { x: 5, y: 0, z: 0 }, isVertex: true },
      { uuid: "2", position: { x: 0, y: 0, z: 0 }, isVertex: true },
      { uuid: "6", position: { x: 3, y: 0, z: 7 }, isVertex: true },
      { uuid: "2", position: { x: 0, y: 0, z: 0 }, isVertex: true },
      { uuid: "3", position: { x: 0, y: 0, z: 10 }, isVertex: true },
      { uuid: "7", position: { x: 8, y: 0, z: 7 }, isVertex: true },
      { uuid: "6", position: { x: 3, y: 0, z: 7 }, isVertex: true },
      { uuid: "3", position: { x: 0, y: 0, z: 10 }, isVertex: true },
      { uuid: "7", position: { x: 8, y: 0, z: 7 }, isVertex: true },
      { uuid: "3", position: { x: 0, y: 0, z: 10 }, isVertex: true },
      { uuid: "4", position: { x: 10, y: 0, z: 10 }, isVertex: true },
      { uuid: "0", position: { x: 10, y: 0, z: 0 }, isVertex: true },
      { uuid: "7", position: { x: 8, y: 0, z: 7 }, isVertex: true },
      { uuid: "4", position: { x: 10, y: 0, z: 10 }, isVertex: true },
      { uuid: "0", position: { x: 10, y: 0, z: 0 }, isVertex: true },
      { uuid: "4", position: { x: 10, y: 0, z: 10 }, isVertex: true },
    ]);
  });

  /**

   2 ----- 1 ---- 0
   |     /  \     |
   |    5 -- 6    |
   |              |
   |              |
   |              |
   3 ------------ 4

   */
  test("Triangulation polygon case 7", () => {
    const ver0 = { uuid: "0", position: { x: 10, y: 0, z: 0 } };
    const ver1 = { uuid: "1", position: { x: 5, y: 0, z: 0 } };
    const ver2 = { uuid: "2", position: { x: 0, y: 0, z: 0 } };
    const ver3 = { uuid: "3", position: { x: 0, y: 0, z: 10 } };
    const ver4 = { uuid: "4", position: { x: 10, y: 0, z: 10 } };

    const ver5 = { uuid: "5", position: { x: 2, y: 0, z: 3 } };
    const ver6 = { uuid: "6", position: { x: 5, y: 0, z: 3 } };

    const graph = new Graph();
    graph.addEdge(ver0, ver1);
    graph.addEdge(ver1, ver2);
    graph.addEdge(ver2, ver3);
    graph.addEdge(ver3, ver4);
    graph.addEdge(ver4, ver0);

    graph.addEdge(ver1, ver5);
    graph.addEdge(ver5, ver6);
    graph.addEdge(ver6, ver1);

    let cycles = graph.getCycles();
    let vertexCycle = graph.getVertexCycle(cycles[0]);

    let triangles = Polygon.getTriangles(vertexCycle, graph);

    expect(triangles).toStrictEqual([
      { uuid: "0", position: { x: 10, y: 0, z: 0 }, isVertex: true },
      { uuid: "1", position: { x: 5, y: 0, z: 0 }, isVertex: true },
      { uuid: "2", position: { x: 0, y: 0, z: 0 }, isVertex: true },
      { uuid: "0", position: { x: 10, y: 0, z: 0 }, isVertex: true },
      { uuid: "2", position: { x: 0, y: 0, z: 0 }, isVertex: true },
      { uuid: "3", position: { x: 0, y: 0, z: 10 }, isVertex: true },
      { uuid: "0", position: { x: 10, y: 0, z: 0 }, isVertex: true },
      { uuid: "3", position: { x: 0, y: 0, z: 10 }, isVertex: true },
      { uuid: "4", position: { x: 10, y: 0, z: 10 }, isVertex: true },
    ]);
  });

  /**
   * TODO: it is problematic
                  10 -- 9
                  |      \
                  |       \
   1 ------------ 0        8
   |              |\       |
   |              | \      |
   |              |  \     |
   |              |   4    |
   |              | /      7
   2 ------------ 3      /
                /      /
              /      /
            5 -----6

   */
  test("Triangulation polygon case 8", () => {
    const ver0 = { uuid: "0", position: { x: 10, y: 0, z: 0 } };
    const ver1 = { uuid: "1", position: { x: 0, y: 0, z: 0 } };
    const ver2 = { uuid: "2", position: { x: 0, y: 0, z: 10 } };
    const ver3 = { uuid: "3", position: { x: 10, y: 0, z: 10 } };

    const ver4 = { uuid: "4", position: { x: 13, y: 0, z: 5 } };
    const ver5 = { uuid: "5", position: { x: 0, y: 0, z: 10 } };
    const ver6 = { uuid: "6", position: { x: 0, y: 0, z: 10 } };
    const ver7 = { uuid: "7", position: { x: 0, y: 0, z: 10 } };
    const ver8 = { uuid: "8", position: { x: 0, y: 0, z: 10 } };
    const ver9 = { uuid: "9", position: { x: 0, y: 0, z: 10 } };
    const ver10 = { uuid: "10", position: { x: 0, y: 0, z: 10 } };

    const graph = new Graph();
    graph.addEdge(ver0, ver1);
    graph.addEdge(ver1, ver2);
    graph.addEdge(ver2, ver3);

    let cycles = graph.getCycles();
    let vertexCycle = graph.getVertexCycle(cycles[0]);

    let triangles = Polygon.getTriangles(vertexCycle, graph);
  });
});

describe("Polygon clockwise", () => {
  /**

   0 ------------- 1
   |               |
   |               |
   |               |
   |               |
   |               |
   3 ------------- 2

   */
  test("Polygon clock", () => {
    const ver0 = { uuid: "0", position: { x: 0, y: 0, z: 0 } };
    const ver1 = { uuid: "1", position: { x: 4, y: 0, z: 0 } };
    const ver2 = { uuid: "2", position: { x: 4, y: 0, z: 4 } };
    const ver3 = { uuid: "3", position: { x: 0, y: 0, z: 4 } };

    const graph = new Graph();
    graph.addEdge(ver0, ver1);
    graph.addEdge(ver1, ver2);
    graph.addEdge(ver2, ver3);
    graph.addEdge(ver3, ver0);

    let cycles = graph.getCycles();

    let vertexCycle = graph.getVertexCycle(cycles[0]);
    let points = vertexCycle.map(
      (v) => new Vector3(v.position.x, 0, v.position.y),
    );
    let triangles = ConcavePolygon.isCycleCounterclockwise(points);

    console.log("triangles", triangles);
    // expect(triangles).toStrictEqual(['0', '1'])
  });

  /**

   1 ------------- 0
   |               |
   |               |
   |               |
   |               |
   |               |
   2 ------------- 3

   */
  test("Polygon counter clock", () => {
    const ver0 = { uuid: "0", position: { x: 4, y: 0, z: 0 } };
    const ver1 = { uuid: "1", position: { x: 0, y: 0, z: 0 } };
    const ver2 = { uuid: "2", position: { x: 0, y: 0, z: 4 } };
    const ver3 = { uuid: "3", position: { x: 4, y: 0, z: 4 } };

    const graph = new Graph();
    graph.addEdge(ver0, ver1);
    graph.addEdge(ver1, ver2);
    graph.addEdge(ver2, ver3);
    graph.addEdge(ver3, ver0);

    let cycles = graph.getCycles();

    let vertexCycle = graph.getVertexCycle(cycles[0]);
    let points = vertexCycle.map(
      (v) => new Vector3(v.position.x, 0, v.position.y),
    );
    let triangles = ConcavePolygon.isCycleCounterclockwise(points);

    console.log("triangles", triangles);
    // expect(triangles).toStrictEqual(['0', '1'])
  });

  /**

   2 ------------- 3
   |               |
   |               |
   |               |
   |               |
   |               |
   1 ------------- 0

   */
  test("Polygon clock case 1", () => {
    const ver0 = { uuid: "0", position: { x: 10, y: 0, z: 10 } };
    const ver1 = { uuid: "1", position: { x: 0, y: 0, z: 10 } };
    const ver2 = { uuid: "2", position: { x: 0, y: 0, z: 0 } };
    const ver3 = { uuid: "3", position: { x: 10, y: 0, z: 0 } };

    const graph = new Graph();
    graph.addEdge(ver0, ver1);
    graph.addEdge(ver1, ver2);
    graph.addEdge(ver2, ver3);
    graph.addEdge(ver3, ver0);

    let cycles = graph.getCycles();

    let vertexCycle = graph.getVertexCycle(cycles[0]);
    let points = vertexCycle.map(
      (v) => new Vector3(v.position.x, 0, v.position.y),
    );
  });

  /**

    0
   | \
   |  \
   |   \
   |    \
   |     \
   1 ---- 2

   */
  test("Polygon clock case 2", () => {
    const ver0 = { uuid: "0", position: { x: 0, y: 0, z: 0 } };
    const ver1 = { uuid: "1", position: { x: 0, y: 0, z: 10 } };
    const ver2 = { uuid: "2", position: { x: 10, y: 0, z: 10 } };
    const ver3 = { uuid: "2", position: { x: 0, y: 0, z: 0 } };

    let points = [ver0, ver1, ver2, ver3].map(
      (v) => new Vector3(v.position.x, v.position.y, v.position.z),
    );

    console.log("points", points);
    let clock = ConcavePolygon.isCycleCounterclockwise(points);
    console.log("clock", clock);
  });
});

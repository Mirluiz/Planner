import { describe, test } from "@jest/globals";
import { Graph, Vertex } from "../app/controller/Graph";
import { Polygon } from "../app/system/utils/Polygon/Polygon";
import { Vector3 } from "three";
import { ConcavePolygon } from "../app/system/utils/Polygon";

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
    const ver0 = { uuid: "0", position: { x: 0, y: 0 } };
    const ver1 = { uuid: "1", position: { x: 4, y: 0 } };
    const ver2 = { uuid: "2", position: { x: 4, y: 4 } };
    const ver3 = { uuid: "3", position: { x: 0, y: 4 } };

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
    const ver0 = { uuid: "0", position: { x: 4, y: 0 } };
    const ver1 = { uuid: "1", position: { x: 8, y: 0 } };
    const ver2 = { uuid: "2", position: { x: 8, y: 4 } };
    const ver3 = { uuid: "3", position: { x: 0, y: 4 } };
    const ver4 = { uuid: "4", position: { x: 0, y: 2 } };
    const ver5 = { uuid: "5", position: { x: 4, y: 2 } };

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
    const ver0 = { uuid: "0", position: { x: 0, y: 0 } };
    const ver1 = { uuid: "1", position: { x: 4, y: 0 } };
    const ver2 = { uuid: "2", position: { x: 4, y: 4 } };
    const ver3 = { uuid: "3", position: { x: 0, y: 4 } };

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
    const ver0 = { uuid: "0", position: { x: 0, y: 0 } };
    const ver1 = { uuid: "1", position: { x: 4, y: 0 } };
    const ver2 = { uuid: "2", position: { x: 5, y: 4 } };
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
    const ver0 = { uuid: "0", position: { x: 4, y: 0 } };
    const ver1 = { uuid: "1", position: { x: 8, y: 0 } };
    const ver2 = { uuid: "2", position: { x: 8, y: 4 } };
    const ver3 = { uuid: "3", position: { x: 0, y: 4 } };
    const ver4 = { uuid: "4", position: { x: 0, y: 2 } };
    const ver5 = { uuid: "5", position: { x: 4, y: 2 } };

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

    console.log("triangulation", triangulation);
  });

  test("test aaa", () => {
    let a = new Vector3(1, 0, 1);
    let b = new Vector3(1, 0, 1);

    console.log(a === b);
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
    const ver0 = { uuid: "0", position: { x: 5, y: 0 } };
    const ver1 = { uuid: "1", position: { x: 0, y: 0 } };
    const ver2 = { uuid: "2", position: { x: 0, y: 4 } };
    const ver3 = { uuid: "3", position: { x: 4, y: 4 } };

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

    let vertexCycle = graph.getVertexCycle(cycles[0]);

    let triangles = Polygon.getTriangles(vertexCycle, graph);

    console.log("triangles", triangles);
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
    const ver0 = { uuid: "0", position: { x: 0, y: 0 } };
    const ver1 = { uuid: "1", position: { x: 4, y: 0 } };
    const ver2 = { uuid: "2", position: { x: 4, y: 4 } };
    const ver3 = { uuid: "3", position: { x: 0, y: 4 } };

    const graph = new Graph();
    graph.addEdge(ver0, ver1);
    graph.addEdge(ver1, ver2);
    graph.addEdge(ver2, ver3);
    graph.addEdge(ver3, ver0);

    let cycles = graph.getCycles();

    let vertexCycle = graph.getVertexCycle(cycles[0]);
    let points = vertexCycle.map(
      (v) => new Vector3(v.position.x, 0, v.position.y)
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
    const ver0 = { uuid: "0", position: { x: 4, y: 0 } };
    const ver1 = { uuid: "1", position: { x: 0, y: 0 } };
    const ver2 = { uuid: "2", position: { x: 0, y: 4 } };
    const ver3 = { uuid: "3", position: { x: 4, y: 4 } };

    const graph = new Graph();
    graph.addEdge(ver0, ver1);
    graph.addEdge(ver1, ver2);
    graph.addEdge(ver2, ver3);
    graph.addEdge(ver3, ver0);

    let cycles = graph.getCycles();

    let vertexCycle = graph.getVertexCycle(cycles[0]);
    let points = vertexCycle.map(
      (v) => new Vector3(v.position.x, 0, v.position.y)
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
      (v) => new Vector3(v.position.x, 0, v.position.y)
    );
  });
});

import { describe, test } from "@jest/globals";
import { Graph, Math2D } from "../app/system";
import { Wall } from "./../app/model/Wall/Wall";
import * as THREE from "three";
import { App } from "../app/App";
import { Polygon } from "../app/system/utils/Polygon";

describe("Polygon", () => {
  test("Triangulation simple polygon", () => {});

  /**

   0 ------------- 1
   |               |
   |    4 --- 5    |
   |    |     |    |
   |    7 --- 6    |
   |               |
   3 ------------- 2

   */

  test("Triangulation polygon with hole", () => {
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

    let res = Polygon.connectInnerOuter(Object.values(graph.vertices), graph);
  });
});

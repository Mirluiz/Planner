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

  test("Triangulation polygon with simple hole", () => {
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

    let outer = [ver0, ver1, ver2, ver3];
    let inner = [ver4, ver5, ver6, ver7];

    let res = Polygon.getVisiblePair(inner, outer, graph);
    console.log("res", res);
  });

  test("Triangulation polygon with hole. ", () => {
    const ver0 = { val: "0", pos: { x: 0, y: 0 } };
    const ver1 = { val: "1", pos: { x: 4, y: 2 } };
    const ver2 = { val: "2", pos: { x: 8, y: -1 } };
    const ver3 = { val: "3", pos: { x: 12, y: -2 } };

    const ver4 = { val: "4", pos: { x: 8, y: -4 } };
    const ver5 = { val: "5", pos: { x: 6, y: -6 } };
    const ver6 = { val: "6", pos: { x: 4, y: -6 } };
    const ver7 = { val: "7", pos: { x: 4.5, y: -3 } };

    const ver8 = { val: "8", pos: { x: 5, y: -5 } };
    const ver9 = { val: "9", pos: { x: 6, y: -4.8 } };

    const ver10 = { val: "10", pos: { x: 7.5, y: -2.5 } };
    const ver11 = { val: "11", pos: { x: 4.5, y: -2 } };
    const ver12 = { val: "12", pos: { x: 3.5, y: -6.5 } };
    const ver13 = { val: "13", pos: { x: 3.5, y: -8.5 } };
    const ver14 = { val: "14", pos: { x: 1.5, y: -6.5 } };

    const ver15 = { val: "15", pos: { x: 1.5, y: -1.5 } };
    const ver16 = { val: "16", pos: { x: 3.5, y: -3.6 } };
    const ver17 = { val: "17", pos: { x: 2.5, y: 0.5 } };

    const graph = new Graph();

    let outer = [
      ver0,
      ver1,
      ver2,
      ver3,
      ver4,
      ver5,
      ver6,
      ver7,
      ver8,
      ver9,
      ver10,
      ver11,
      ver12,
      ver13,
      ver14,
    ];
    let inner = [ver15, ver16, ver17];
    let res = Polygon.getVisiblePair(inner, outer, graph);
  });

  test("Triangulation polygon with hole. connection check", () => {
    const ver0 = { val: "0", pos: { x: 0, y: 0 } };
    const ver1 = { val: "1", pos: { x: 4, y: 2 } };
    const ver2 = { val: "2", pos: { x: 8, y: -1 } };
    const ver3 = { val: "3", pos: { x: 12, y: -2 } };

    const ver4 = { val: "4", pos: { x: 8, y: -4 } };
    const ver5 = { val: "5", pos: { x: 6, y: -6 } };
    const ver6 = { val: "6", pos: { x: 4, y: -6 } };
    const ver7 = { val: "7", pos: { x: 4.5, y: -3 } };

    const ver8 = { val: "8", pos: { x: 5, y: -5 } };
    const ver9 = { val: "9", pos: { x: 6, y: -4.8 } };

    const ver10 = { val: "10", pos: { x: 7.5, y: -2.5 } };
    const ver11 = { val: "11", pos: { x: 4.5, y: -2 } };
    const ver12 = { val: "12", pos: { x: 3.5, y: -6.5 } };
    const ver13 = { val: "13", pos: { x: 3.5, y: -8.5 } };
    const ver14 = { val: "14", pos: { x: 1.5, y: -6.5 } };

    const ver15 = { val: "15", pos: { x: 1.5, y: -1.5 } };
    const ver16 = { val: "16", pos: { x: 3.5, y: -3.6 } };
    const ver17 = { val: "17", pos: { x: 2.5, y: 0.5 } };

    const graph = new Graph();

    let outer = [
      ver0,
      ver1,
      ver2,
      ver3,
      ver4,
      ver5,
      ver6,
      ver7,
      ver8,
      ver9,
      ver10,
      ver11,
      ver12,
      ver13,
      ver14,
    ];
    let inner = [ver15, ver16, ver17];
    let res = Polygon.connectInnerOuter(inner, outer, graph);
    console.log("res ", res);
  });
});

import { describe, test } from "@jest/globals";
import { Graph, Math2D } from "../../app/system";
import { Wall } from "../../app/model/Wall/Wall";
import * as THREE from "three";
import { App } from "../../app/App";
import { Polygon } from "../../app/system/utils/Polygon/Polygon";
import { ConcavePolygon, ConvexPolygon } from "../../app/system/utils/Polygon";

describe("Intersections", () => {
  test("Intersection", () => {
    let line1Ver = { x: 4, y: -3 };
    let line2Ver = { x: 4, y: 3 };

    let line = {
      start: new THREE.Vector3(line1Ver.x, 0, line1Ver.y),
      end: new THREE.Vector3(line2Ver.x, 0, line2Ver.y),
    };
    let origin = new THREE.Vector3(0, 0, 0);
    let direction = new THREE.Vector3(1, 0, 0);

    let res = ConcavePolygon.intersect({ origin, direction }, line);
    expect(res).toBe(null);
  });

  /**

            *
            |
            |
            |
            *

    -------->
   */
  test("Intersection case 1", () => {
    let end1 = { x: 4, y: 5 };
    let end2 = { x: 4, y: 10 };

    let originPos = { x: 0, y: 0 };

    let line = {
      start: new THREE.Vector3(end1.x, 0, end1.y),
      end: new THREE.Vector3(end2.x, 0, end2.y),
    };
    let origin = new THREE.Vector3(originPos.x, 0, originPos.y);
    let direction = new THREE.Vector3(1, 0, 0);

    let res = ConcavePolygon.intersect({ origin, direction }, line);
    expect(res).toBe(null);
  });

  /**

   -------->

             *
             |
             |
             |
             *
   */
  test("Intersection case 2", () => {
    let end1 = { x: 4, y: -5 };
    let end2 = { x: 4, y: -10 };

    let originPos = { x: 0, y: 0 };

    let line = {
      start: new THREE.Vector3(end1.x, 0, end1.y),
      end: new THREE.Vector3(end2.x, 0, end2.y),
    };
    let origin = new THREE.Vector3(originPos.x, 0, originPos.y);
    let direction = new THREE.Vector3(1, 0, 0);

    let res = ConcavePolygon.intersect({ origin, direction }, line);
    expect(res).toBe(null);
  });

  /**
              *
   -------->  |
              |
              *
   */
  test("Intersection case 3", () => {
    let end1 = { x: 4, y: 10 };
    let end2 = { x: 4, y: -10 };

    let originPos = { x: 0, y: 0 };

    let line = {
      start: new THREE.Vector3(end1.x, 0, end1.y),
      end: new THREE.Vector3(end2.x, 0, end2.y),
    };
    let origin = new THREE.Vector3(originPos.x, 0, originPos.y);
    let direction = new THREE.Vector3(1, 0, 0);

    let res = ConcavePolygon.intersect({ origin, direction }, line);
    expect(res).toEqual({
      distance: 4,
      line: { end: { x: 4, y: 0, z: -10 }, start: { x: 4, y: 0, z: 10 } },
      position: { x: 4, y: 0, z: 0 },
    });
  });

  /**

              *
               \
                \
                 *
    -------->

   */
  test("Intersection case 4", () => {
    let end1 = { x: 4, y: 10 };
    let end2 = { x: 4, y: 1 };

    let originPos = { x: 0, y: 0 };

    let line = {
      start: new THREE.Vector3(end1.x, 0, end1.y),
      end: new THREE.Vector3(end2.x, 0, end2.y),
    };
    let origin = new THREE.Vector3(originPos.x, 0, originPos.y);
    let direction = new THREE.Vector3(1, 0, 0);

    let res = ConcavePolygon.intersect({ origin, direction }, line);
    expect(res).toBe(null);
  });
});

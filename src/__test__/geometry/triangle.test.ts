import { describe, test } from "@jest/globals";
import { Math2D } from "../../system";
import { Wall } from "../../app/model";
import * as THREE from "three";
import { Vector3 } from "three";
import { ConcavePolygon } from "../../system/utils/Polygon";

describe("Triangle algorithms", () => {
  /**

   0
   |\
   | \
   |  \
   | * \
   1 -- 2

   */

  test("Is vertex in triangle", () => {
    let v0 = new Vector3(0, 0, 0);
    let v1 = new Vector3(0, 0, 10);
    let v2 = new Vector3(10, 0, 10);

    let point = new Vector3(4, 0, 5);

    let res = ConcavePolygon.pointInTriangle(v0, v1, v2, point);
    console.log("res", res);
  });
});

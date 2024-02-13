import { describe, test } from "@jest/globals";
import { Math2D } from "../../app/system";
import { Wall } from "../../app/model/Wall/Wall";
import * as THREE from "three";
import { WallEnd } from "../../app/model/Wall/WallEnd";

describe("Line algorithms", () => {
  test("line ends intersection", () => {
    let start = new WallEnd({ x: -4, y: 0, z: 4 });
    let end = new WallEnd({ x: 4, y: 0, z: -4 });

    const line = new Wall({ start: start, end: end });
    // const point = new THREE.Vector3(-4.2, 0, 4.2);
    const point = new THREE.Vector3(-5, 0, 5);

    // let res = Math2D.Line.vectorLineIntersectionPosition(point, line);
    // console.log("res", res);
  });
});

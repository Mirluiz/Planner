import { describe, expect, test } from "@jest/globals";
import { Math2D } from "../app/system";
import { Wall } from "./../app/model/Wall/Wall";
import * as THREE from "three";
import { App } from "../app/App";

describe("Wall controller processes", () => {
  function createWall(
    startPos: { x: number; y: number; z: number },
    endPos: { x: number; y: number; z: number }
  ) {
    let start = new THREE.Vector3(startPos.x, startPos.y, startPos.z);
    let end = new THREE.Vector3(endPos.x, endPos.y, endPos.z);

    return new Wall({ start, end, position: { x: 0, y: 0, z: 0 } });
  }

  test("Wall start to another wall start", () => {
    let app = new App({ canvas: null });
    let controller = app.wallController;

    let wall = createWall({ x: 0, y: 0, z: 0 }, { x: 0, y: 0, z: 4 });

    app.sceneController.model.addObject(wall);

    controller.start({ x: 0.6, y: 0, z: 4.5 });

    expect(app.sceneController.model.objects.length).toBe(3);
  });
  test("Wall end to another wall start", () => {});
  test("Wall start to another wall end", () => {});
  test("Wall end to another wall end", () => {});

  test("Wall start to another wall body", () => {});
  test("Wall end to another wall body", () => {});

  test("Wall end to corner", () => {});
  test("Wall end to corner with multiply walls", () => {});

  test("Wall end to pick closest from multiply walls", () => {});
});

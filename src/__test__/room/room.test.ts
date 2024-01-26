import { describe, expect, test } from "@jest/globals";
import { Math2D } from "../../app/system";
import { Wall } from "./../../app/model/Wall/Wall";
import * as THREE from "three";
import { App } from "../../app/App";
import { WallEnd } from "../../app/model/Wall/WallEnd";

describe("Wall controller processes", () => {
  function createWall(
    startPos: { x: number; y: number; z: number },
    endPos: { x: number; y: number; z: number }
  ) {
    let start = new WallEnd(startPos.x, startPos.y, startPos.z);
    let end = new WallEnd(endPos.x, endPos.y, endPos.z);

    return new Wall({ start, end, position: { x: 0, y: 0, z: 0 } });
  }

  test("1 room, square", () => {
    let app = new App({ canvas: null });
    let wallController = app.wallController;
    let roomController = app.roomController;

    wallController.startDraw({ x: 0, y: 0, z: 0 });

    wallController.draw({ x: 0, y: 0, z: 5 });
    wallController.startDraw({ x: 0, y: 0, z: 5 });

    wallController.draw({ x: 10, y: 0, z: 5 });
    wallController.startDraw({ x: 10, y: 0, z: 5 });

    wallController.draw({ x: 10, y: 0, z: 0 });
    wallController.startDraw({ x: 10, y: 0, z: 0 });

    wallController.draw({ x: 0, y: 0, z: 0 });
    wallController.startDraw({ x: 0, y: 0, z: 0 });

    wallController.reset();

    let corners = wallController.corners;
    let walls = wallController.walls;

    let rooms = roomController.rooms;

    expect(corners.length).toBe(4);
    expect(walls.length).toBe(4);
    expect(rooms.length).toBe(1);
  });
  test("2 room, two squares, one small", () => {
    let app = new App({ canvas: null });
    let wallController = app.wallController;
    let roomController = app.roomController;

    wallController.startDraw({ x: 0, y: 0, z: 0 });

    wallController.draw({ x: 0, y: 0, z: 5 });
    wallController.startDraw({ x: 0, y: 0, z: 5 });

    wallController.draw({ x: 10, y: 0, z: 5 });
    wallController.startDraw({ x: 10, y: 0, z: 5 });

    wallController.draw({ x: 10, y: 0, z: 0 });
    wallController.startDraw({ x: 10, y: 0, z: 0 });

    wallController.draw({ x: 0, y: 0, z: 0 });
    wallController.startDraw({ x: 0, y: 0, z: 0 });

    wallController.reset();

    wallController.startDraw({ x: 10, y: 0, z: 3 });

    wallController.draw({ x: 15, y: 0, z: 3 });
    wallController.startDraw({ x: 15, y: 0, z: 3 });

    wallController.draw({ x: 15, y: 0, z: 0 });
    wallController.startDraw({ x: 15, y: 0, z: 0 });

    wallController.draw({ x: 10, y: 0, z: 0 });
    wallController.startDraw({ x: 10, y: 0, z: 0 });

    wallController.reset();

    let corners = wallController.corners;
    let walls = wallController.walls;
    let rooms = roomController.rooms;

    expect(corners.length).toBe(7);
    expect(walls.length).toBe(8);
    expect(rooms.length).toBe(2);
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

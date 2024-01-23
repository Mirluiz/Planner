import { describe, expect, test } from "@jest/globals";
import { App } from "../../app/App";

describe("Room with holes", () => {
  /*
       0 ------------- 1
       |               |
       |    4 --- 5    |
       |    |     |    |
       |    7 --- 6    |
       |               |
       3 ------------- 2

   */
  test("Room with hole 1 case", () => {
    let corners = [
      { pos: { x: 0, y: 0, z: 0 } },
      { pos: { x: 6, y: 0, z: 0 } },
      { pos: { x: 6, y: 0, z: 6 } },
      { pos: { x: 0, y: 0, z: 6 } },
      { pos: { x: 0, y: 0, z: 0 } },

      null,

      { pos: { x: 1, y: 0, z: 2 } },
      { pos: { x: 5, y: 0, z: 2 } },
      { pos: { x: 3, y: 0, z: 3 } },
      { pos: { x: 1, y: 0, z: 3 } },
      { pos: { x: 1, y: 0, z: 2 } },

      null,
    ];

    let app = new App({ canvas: null });
    let wallController = app.wallController;
    let roomController = app.roomController;

    corners.map((cornerData) => {
      if (!cornerData) {
        wallController.reset();
      } else {
        wallController.startDraw({
          x: cornerData.pos.x,
          y: cornerData.pos.y,
          z: cornerData.pos.z,
        });
      }
    });

    wallController.reset();

    expect(roomController.rooms.length).toBe(2);
  });

  /*
     0 ---------------------- 1
     |                        |
     |    4 ---- 5            |
     |    |     /             |
     |    7 -- 6              |
     |                        |
     3 ---------------------- 2
   */
  test("Room with hole 2 case", () => {
    let app = new App({ canvas: null });
    let wallController = app.wallController;
    let roomController = app.roomController;
  });
});

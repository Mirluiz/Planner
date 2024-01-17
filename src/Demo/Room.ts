import { Corner } from "../app/model";
import { App } from "../app/App";
import { Helpers, Object3DProps } from "../app/system";

class Room {
  readonly app: App;
  examples: Array<{
    name: string;
    corners: Array<{ pos: { x: number; y: number; z: number } } | null>;
  }> = [
    {
      name: "Short",
      corners: [
        { pos: { x: 0, y: 0, z: 0 } },
        { pos: { x: 1, y: 0, z: 1 } },
        { pos: { x: 0, y: 0, z: 1 } },
        null,
      ],
    },
    {
      name: "Simple Room, 5 corners",
      corners: [
        { pos: { x: -2, y: 0, z: -2 } },
        { pos: { x: -2, y: 0, z: 2 } },
        { pos: { x: 0, y: 0, z: 0 } },
        { pos: { x: 2, y: 0, z: 2 } },
        { pos: { x: 2, y: 0, z: -2 } },
      ],
    },
    {
      name: "Simple Room, 4 corners",
      corners: [
        { pos: { x: -2, y: 0, z: -2 } },
        { pos: { x: -2, y: 0, z: 2 } },
        { pos: { x: 2, y: 0, z: 2 } },
        { pos: { x: 2, y: 0, z: -2 } },
      ],
    },
    {
      name: "Simple Room, 6 corners",
      corners: [
        { pos: { x: -4, y: 0, z: 4 } },
        { pos: { x: -6, y: 0, z: 0 } },
        { pos: { x: -4, y: 0, z: -4 } },

        { pos: { x: 4, y: 0, z: -4 } },
        { pos: { x: 6, y: 0, z: 0 } },
        { pos: { x: 4, y: 0, z: 4 } },
      ],
    },
    {
      name: "concave, 6 corners",
      corners: [
        { pos: { x: -4, y: 0, z: 4 } },
        { pos: { x: -6, y: 0, z: 0 } },
        { pos: { x: -4, y: 0, z: -4 } },

        { pos: { x: 1, y: 0, z: 0 } },

        { pos: { x: 2, y: 0, z: -2 } },

        { pos: { x: 4, y: 0, z: -4 } },
        { pos: { x: 6, y: 0, z: 0 } },
        { pos: { x: 4, y: 0, z: 4 } },
      ],
    },
    {
      name: "char R, 11 corners",
      corners: [
        { pos: { x: 4, y: 0, z: -8 } },
        { pos: { x: -4, y: 0, z: -8 } },
        { pos: { x: -4, y: 0, z: 8 } },
        { pos: { x: 4, y: 0, z: 8 } },
        { pos: { x: 4, y: 0, z: -8 } },

        { pos: { x: 12, y: 0, z: -8 } },
        { pos: { x: 12, y: 0, z: -2 } },
        { pos: { x: 4, y: 0, z: -2 } },

        null,

        { pos: { x: 8, y: 0, z: -2 } },
        { pos: { x: 10, y: 0, z: 8 } },

        null,

        { pos: { x: 4, y: 0, z: 4 } },
        { pos: { x: 6, y: 0, z: 8 } },
        { pos: { x: 10, y: 0, z: 8 } },
      ],
    },
    {
      name: "char R, 11 corners",
      corners: [
        { pos: { x: 4, y: 0, z: 8 } },
        { pos: { x: 4, y: 0, z: -8 } },
        { pos: { x: 12, y: 0, z: -8 } },
        { pos: { x: 12, y: 0, z: -2 } },
        { pos: { x: 4, y: 0, z: -2 } },

        null,

        { pos: { x: 8, y: 0, z: -2 } },
        { pos: { x: 8, y: 0, z: 8 } },
        null,
        { pos: { x: 6, y: 0, z: 8 } },
        { pos: { x: 4, y: 0, z: 4 } },
      ],
    },
  ];

  constructor(props: { app: App }) {
    this.app = props.app;
  }

  run() {
    let wallController = this.app.wallController;
    let roomController = this.app.roomController;
    let { corners } = this.examples[0];

    corners.map((cornerData, index) => {
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

    console.log("wallController.graph", wallController.graph);
  }
}

export { Room };

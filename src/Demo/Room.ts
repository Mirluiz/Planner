import { App } from "../app/App";

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
    {
      name: "Inner cycle example",
      corners: [
        { pos: { x: -8, y: 0, z: -8 } },
        { pos: { x: -4, y: 0, z: -8 } },
        { pos: { x: -4, y: 0, z: -4 } },
        { pos: { x: 0, y: 0, z: -4 } },
        { pos: { x: -2, y: 0, z: -6 } },
        { pos: { x: 2, y: 0, z: -6 } },
        { pos: { x: 4, y: 0, z: -4 } },

        { pos: { x: 0, y: 0, z: -4 } },

        null,

        { pos: { x: -2, y: 0, z: -6 } },
        { pos: { x: -4, y: 0, z: -8 } },
        { pos: { x: 8, y: 0, z: -8 } },
        { pos: { x: 8, y: 0, z: 0 } },
        { pos: { x: -4, y: 0, z: 0 } },
        { pos: { x: -8, y: 0, z: 0 } },
        { pos: { x: -8, y: 0, z: -8 } },

        null,
      ],
    },
    {
      name: "Room with hole",
      corners: [
        { pos: { x: 0, y: 0, z: 0 } },
        { pos: { x: 4, y: 0, z: 0 } },
        { pos: { x: 4, y: 0, z: 4 } },
        { pos: { x: 0, y: 0, z: 4 } },
        { pos: { x: 0, y: 0, z: 0 } },

        null,

        { pos: { x: 2, y: 0, z: 2 } },
        { pos: { x: 3, y: 0, z: 2 } },
        { pos: { x: 3, y: 0, z: 3 } },
        { pos: { x: 2, y: 0, z: 3 } },
        { pos: { x: 2, y: 0, z: 2 } },

        null,
      ],
    },
  ];

  constructor(props: { app: App }) {
    this.app = props.app;
  }

  run() {
    let wallController = this.app.wallController;
    let roomController = this.app.roomController;
    let { corners } = this.examples[8];

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
  }
}

export { Room };

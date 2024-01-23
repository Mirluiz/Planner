import { App } from "../../app/App";

class Hole {
  readonly app: App;
  examples: Array<{
    name: string;
    corners: Array<{ pos: { x: number; y: number; z: number } } | null>;
  }> = [
    // {
    //   name: "Room with hole",
    //   corners: [
    //     { pos: { x: 0, y: 0, z: 0 } },
    //     { pos: { x: 6, y: 0, z: 0 } },
    //     { pos: { x: 6, y: 0, z: 6 } },
    //     { pos: { x: 0, y: 0, z: 6 } },
    //     { pos: { x: 0, y: 0, z: 0 } },
    //
    //     null,
    //
    //     { pos: { x: 1, y: 0, z: 2 } },
    //     { pos: { x: 5, y: 0, z: 2 } },
    //     { pos: { x: 3, y: 0, z: 3 } },
    //     { pos: { x: 1, y: 0, z: 3 } },
    //     { pos: { x: 1, y: 0, z: 2 } },
    //
    //     null,
    //   ],
    // },
    // {
    //   name: "Room with hole case 1",
    //   corners: [
    //     { pos: { x: 6, y: 0, z: 0 } },
    //     { pos: { x: 0, y: 0, z: 0 } },
    //     { pos: { x: 0, y: 0, z: 6 } },
    //     { pos: { x: 6, y: 0, z: 6 } },
    //     { pos: { x: 6, y: 0, z: 0 } },
    //
    //     null,
    //
    //     { pos: { x: 2, y: 0, z: 2 } },
    //     { pos: { x: 3, y: 0, z: 2 } },
    //     { pos: { x: 3, y: 0, z: 3 } },
    //     { pos: { x: 2, y: 0, z: 3 } },
    //     { pos: { x: 2, y: 0, z: 2 } },
    //
    //     null,
    //   ],
    // },
    // {
    //   name: "Room with hole case 2",
    //   corners: [
    //     { pos: { x: 6, y: 0, z: 0 } },
    //     { pos: { x: 0, y: 0, z: 0 } },
    //     { pos: { x: 0, y: 0, z: 6 } },
    //     { pos: { x: 6, y: 0, z: 6 } },
    //     { pos: { x: 6, y: 0, z: 0 } },
    //
    //     null,
    //
    //     { pos: { x: 2, y: 0, z: 2 } },
    //     { pos: { x: 3, y: 0, z: 2 } },
    //     { pos: { x: 3, y: 0, z: 3 } },
    //     { pos: { x: 2, y: 0, z: 3 } },
    //     { pos: { x: 2, y: 0, z: 2 } },
    //
    //     null,
    //   ],
    // },
    {
      name: "Room with hole case 3",
      corners: [
        { pos: { x: 0, y: 0, z: 0 } },
        { pos: { x: 6, y: 0, z: 0 } },
        { pos: { x: 6, y: 0, z: 6 } },
        { pos: { x: 0, y: 0, z: 6 } },
        { pos: { x: 0, y: 0, z: 0 } },

        null,

        { pos: { x: 3, y: 0, z: 0 } },
        { pos: { x: 3, y: 0, z: 2 } },
        { pos: { x: 2, y: 0, z: 3 } },
        { pos: { x: 4, y: 0, z: 3 } },
        { pos: { x: 3, y: 0, z: 2 } },

        null,
      ],
    },
    {
      name: "Room with hole case 4",
      corners: [
        { pos: { x: 0, y: 0, z: 0 } },
        { pos: { x: 6, y: 0, z: 0 } },
        { pos: { x: 6, y: 0, z: 6 } },
        { pos: { x: 0, y: 0, z: 6 } },
        { pos: { x: 0, y: 0, z: 0 } },

        null,

        { pos: { x: 3, y: 0, z: 0 } },
        { pos: { x: 2, y: 0, z: 3 } },
        { pos: { x: 4, y: 0, z: 3 } },
        { pos: { x: 3, y: 0, z: 0 } },

        null,
      ],
    },
  ];

  constructor(props: { app: App }) {
    this.app = props.app;
  }

  run() {
    let wallController = this.app.wallController;

    let xOffset = -10;
    let zOffset = -10;

    this.examples.map((examples, index) => {
      let { corners } = examples;

      corners.map((cornerData) => {
        if (!cornerData) {
          wallController.reset();
        } else {
          wallController.startDraw({
            x: cornerData.pos.x + xOffset,
            y: cornerData.pos.y,
            z: cornerData.pos.z + zOffset,
          });
        }
      });

      xOffset += 9;
    });
    wallController.reset();
  }
}

export { Hole };

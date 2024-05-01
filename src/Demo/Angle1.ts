import { App } from "../app/App";

class Angle {
  readonly app: App;
  examples: Array<{
    name: string;
    corners: Array<{ pos: { x: number; y: number; z: number } } | null>;
  }> = [
    {
      name: "from left to right, bottom to up",
      corners: [
        { pos: { x: 0, y: 0, z: 0 } },
        { pos: { x: 2, y: 0, z: 0 } },
        null,
        { pos: { x: 2, y: 0, z: 2 } },
        { pos: { x: 2, y: 0, z: 0 } },
        null,
      ],
    },
    {
      name: "from right to left, bottom to up",
      corners: [
        { pos: { x: 2, y: 0, z: 0 } },
        { pos: { x: 0, y: 0, z: 0 } },
        null,
        { pos: { x: 2, y: 0, z: 2 } },
        { pos: { x: 2, y: 0, z: 0 } },
        null,
      ],
    },
    {
      name: "from left to right, up to bottom",
      corners: [
        { pos: { x: 0, y: 0, z: 0 } },
        { pos: { x: 2, y: 0, z: 0 } },
        null,
        { pos: { x: 2, y: 0, z: 0 } },
        { pos: { x: 2, y: 0, z: 2 } },
        null,
      ],
    },
    {
      name: "from right to left, up to bottom",
      corners: [
        { pos: { x: 2, y: 0, z: 0 } },
        { pos: { x: 0, y: 0, z: 0 } },
        null,
        { pos: { x: 2, y: 0, z: 0 } },
        { pos: { x: 2, y: 0, z: 2 } },
        null,
      ],
    },

    {
      name: "left to right, left to right",
      corners: [
        { pos: { x: -2, y: 0, z: 2 } },
        { pos: { x: 0, y: 0, z: 0 } },
        null,
        { pos: { x: 0, y: 0, z: 0 } },
        { pos: { x: 2, y: 0, z: 2 } },
        null,
      ],
    },
    {
      name: "right to left, left to right",
      corners: [
        { pos: { x: 0, y: 0, z: 0 } },
        { pos: { x: -2, y: 0, z: 2 } },
        null,
        { pos: { x: 0, y: 0, z: 0 } },
        { pos: { x: 2, y: 0, z: 2 } },
        null,
      ],
    },
    {
      name: "left to right, right to left",
      corners: [
        { pos: { x: -2, y: 0, z: 2 } },
        { pos: { x: 0, y: 0, z: 0 } },
        null,
        { pos: { x: 2, y: 0, z: 2 } },
        { pos: { x: 0, y: 0, z: 0 } },
        null,
      ],
    },
    {
      name: "left to right, left to right",
      corners: [
        { pos: { x: 0, y: 0, z: 0 } },
        { pos: { x: -2, y: 0, z: 2 } },
        null,
        { pos: { x: 0, y: 0, z: 0 } },
        { pos: { x: 2, y: 0, z: 2 } },
        null,
      ],
    },

    {
      name: "left to right, left to right",
      corners: [
        { pos: { x: -1, y: 0, z: -2 } },
        { pos: { x: 0, y: 0, z: 0 } },
        null,
        { pos: { x: 0, y: 0, z: 0 } },
        { pos: { x: -1, y: 0, z: 2 } },
        null,
      ],
    },
  ];

  constructor(props: { app: App }) {
    this.app = props.app;
  }

  run() {
    let wallController = this.app.wallController;
    let screenOffsetX = -15;
    let screenOffsetZ = -8;

    this.examples.map((example, index) => {
      let { corners } = example;
      let offsetZ = Math.trunc(index / 6) * 5;
      let offsetX = (index % 6) * 5;

      corners.map((cornerData, index) => {
        if (!cornerData) {
          wallController.reset();
        } else {
          wallController.startDraw({
            x: cornerData.pos.x + screenOffsetX + offsetX,
            y: cornerData.pos.y,
            z: cornerData.pos.z + screenOffsetZ + offsetZ,
          });
        }
      });

      wallController.reset();
    });
  }
}

export { Angle };

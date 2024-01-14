import { Corner } from "../app/model";
import { App } from "../app/App";
import { Helpers, Object3DProps } from "../app/system";

class Room {
  readonly app: App;
  examples = [
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
  ];

  constructor(props: { app: App }) {
    this.app = props.app;
  }

  run() {
    let cornerProps: Object3DProps = {
      position: { x: 0, y: 0, z: 0 },
      rotation: { w: 0, x: 0, y: 0, z: 0 },
      uuid: Helpers.uuid(),
      dimension: { width: 0.1, depth: 1, height: 1 },
    };

    let roomCorners: Array<Corner> = [];

    this.examples[3].corners.map((cornerData) => {
      let corner = new Corner({
        rotation: { w: 0, x: 0, y: 0, z: 0 },
        uuid: Helpers.uuid(),
        dimension: { width: 0.1, depth: 1, height: 1 },
        position: {
          x: cornerData.pos.x,
          y: cornerData.pos.y,
          z: cornerData.pos.z,
        },
      });
      this.app.sceneController.model.addObject(corner);

      roomCorners.push(corner);
    });

    if (roomCorners.length > 0) {
      this.app.roomController.updateByCorners([roomCorners]);
    }
  }
}

export { Room };

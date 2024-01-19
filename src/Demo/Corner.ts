import { Corner as CornerModel } from "../app/model";
import { App } from "../app/App";
import { Helpers, Object3DProps } from "../app/system";
import { Room } from "../app/model/Room";

class Corner {
  readonly app: App;
  examples = [
    {
      name: "Center Dot",
      corners: [
        { pos: { x: 0, y: 0, z: 0 } },
        { pos: { x: 4, y: 0, z: 0 } },
        { pos: { x: 4, y: 0, z: 4 } },
        { pos: { x: 0, y: 0, z: 4 } },
        { pos: { x: 1, y: 0, z: 1 } },
        { pos: { x: 3, y: 0, z: 1 } },
        { pos: { x: 3, y: 0, z: 3 } },
        { pos: { x: 1, y: 0, z: 3 } },
      ],
    },
    {
      //https://www.geometrictools.com/Documentation/TriangulationByEarClipping.pdf
      name: "Figure 10",
      corners: [
        { pos: { x: 0, y: 0, z: 0 } },
        { pos: { x: 4, y: 0, z: 2 } },
        { pos: { x: 8, y: 0, z: -1 } },
        { pos: { x: 12, y: 0, z: -2 } },
        { pos: { x: 8, y: 0, z: -4 } },
        { pos: { x: 6, y: 0, z: -6 } },
        { pos: { x: 4, y: 0, z: -6 } },
        { pos: { x: 4.5, y: 0, z: -3 } }, //7
        { pos: { x: 5, y: 0, z: -5 } },
        { pos: { x: 6, y: 0, z: -4.8 } },

        { pos: { x: 7.5, y: 0, z: -2.5 } },
        { pos: { x: 4.5, y: 0, z: -2 } },
        { pos: { x: 3.5, y: 0, z: -6.5 } },
        { pos: { x: 3.5, y: 0, z: -8.5 } }, //13
        { pos: { x: 1.5, y: 0, z: -6.5 } },

        { pos: { x: 1.5, y: 0, z: -1.5 } },
        { pos: { x: 2.5, y: 0, z: 0.5 } },
        { pos: { x: 3.5, y: 0, z: -3.6 } },
      ],
    },
  ];

  constructor(props: { app: App }) {
    this.app = props.app;
  }

  run() {
    let corners: Array<CornerModel> = [];

    this.examples[1].corners.map((cornerData, index) => {
      let corner = new CornerModel({
        rotation: { w: 0, x: 0, y: 0, z: 0 },
        // uuid: Helpers.uuid(),
        uuid: index.toString(),
        dimension: { width: 0.1, depth: 1, height: 1 },
        position: {
          x: cornerData.pos.x,
          y: cornerData.pos.y,
          z: cornerData.pos.z,
        },
      });
      this.app.sceneController.model.addObject(corner);

      corners.push(corner);
    });

    let room = new Room({
      position: { x: 0, y: 0, z: 0 },
      rotation: { w: 0, x: 0, y: 0, z: 0 },
      uuid: Helpers.uuid(),
      dimension: { width: 0.1, depth: 1, height: 1 },
    });

    room.corners.push(...corners);
    this.app.sceneController.model.addObject(room);
  }
}

export { Corner };

import { Corner as CornerModel } from "../app/model";
import { App } from "../app/App";
import { Helpers, Object3DProps } from "../app/system";

class Corner {
  readonly app: App;
  examples = [
    {
      name: "Center Dot",
      corners: [{ pos: { x: 0, y: 0, z: 0 } }],
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

    let corners: Array<CornerModel> = [];

    this.examples[0].corners.map((cornerData) => {
      let corner = new CornerModel({
        ...cornerProps,
        position: {
          x: cornerData.pos.x,
          y: cornerData.pos.y,
          z: cornerData.pos.z,
        },
      });
      this.app.sceneController.model.addObject(corner);

      corners.push(corner);
    });
  }
}

export { Corner };

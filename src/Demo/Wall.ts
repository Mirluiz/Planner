import { Corner } from "../app/model";
import { App } from "../app/App";
import { Helpers, Object3DProps } from "../app/system";
import { Wall as WallModel } from "../app/model/Wall/Wall";
import * as THREE from "three";
import { WallEnd } from "../app/model/Wall/WallEnd";

class Wall {
  readonly app: App;
  examples = [
    {
      name: "One Wall",
      ends: [
        { x: 0, y: 0, z: -2 },
        { x: 0.2, y: 0, z: 3 },
      ],
    },
    {
      name: "One Wall",
      ends: [
        { x: 10, y: 0, z: 0 },
        { x: 10, y: 0, z: 5 },
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

    this.examples.map((cornerData, index) => {
      let wall = new WallModel({
        ...cornerProps,
        start: new WallEnd({
          x: cornerData.ends[0].x,
          y: cornerData.ends[0].y,
          z: cornerData.ends[0].z,
        }),
        end: new WallEnd({
          x: cornerData.ends[1].x,
          y: cornerData.ends[1].y,
          z: cornerData.ends[1].z,
        }),
      });
      wall.startAngle = Math.PI / 4;
      wall.endAngle = Math.PI / 4;

      wall.updateCenter();

      // wall.endAngle = Math.PI / 2;
      this.app.sceneController.model.addObject(wall);
    });
  }
}

export { Wall };

import { Corner } from "../app/model";
import { App } from "../app/App";
import { Helpers, Object3DProps } from "../app/system";
import { Wall as WallModel } from "../app/model/Wall/Wall";
import * as THREE from "three";

class Wall {
  readonly app: App;
  examples = [
    {
      name: "One Wall",
      ends: [
        { x: -6, y: 0, z: -4 },
        { x: 0, y: 0, z: -9 },
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

    this.examples.map((cornerData) => {
      let wall = new WallModel({
        ...cornerProps,
        start: new THREE.Vector3(
          cornerData.ends[0].x,
          cornerData.ends[0].y,
          cornerData.ends[0].z
        ),
        end: new THREE.Vector3(
          cornerData.ends[1].x,
          cornerData.ends[1].y,
          cornerData.ends[1].z
        ),
      });
      this.app.sceneController.model.addObject(wall);
    });
  }
}

export { Wall };

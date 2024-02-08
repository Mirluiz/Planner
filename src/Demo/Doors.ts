import { Corner } from "../app/model";
import { App } from "../app/App";
import { Helpers, Object3DProps } from "../app/system";
import { Door as DoorModel } from "../app/model";
import * as THREE from "three";
import { WallEnd } from "../app/model/Wall/WallEnd";

class Door {
  readonly app: App;
  examples = [
    {
      name: "Simple Door",
      ends: [
        { x: -2, y: 0, z: -2 },
        { x: 2, y: 0, z: 2 },
      ],
    },
  ];

  constructor(props: { app: App }) {
    this.app = props.app;
  }

  run() {
    this.examples.map((data, index) => {
      let door = new DoorModel({
        position: { x: 0, y: 0, z: index * 2 },
        rotation: { w: 0, x: 0, y: 0, z: 0 },
        uuid: Helpers.uuid(),
        dimension: { width: 0.1, depth: 1, height: 1 },
      });

      this.app.sceneController.model.addObject(door);
    });
  }
}

export { Door };

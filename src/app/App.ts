import { Scene as SceneController } from "./controller/Scene";
import { Pipe as PipeController } from "../app/controller/Pipe";
import { Wall as WallController } from "../app/controller/Wall";
import { Room as RoomController } from "../app/controller/Room";
import {
  EventSystem,
  Database,
  Object3D,
  Object3DProps,
  Helpers,
} from "./system";
import { Room } from "./model/Room";
import { randomUUID } from "node:crypto";
import { Corner } from "./model";

class App {
  database: Database = new Database();
  event: EventSystem = new EventSystem();
  active: Object3D | null = null;

  sceneController: SceneController;
  wallController: WallController;
  pipeController: PipeController;
  roomController: RoomController;

  constructor(props: { canvas: HTMLElement }) {
    this.sceneController = new SceneController(props);

    this.roomController = new RoomController({ scene: this.sceneController });
    this.pipeController = new PipeController({
      scene: this.sceneController,
    });
    this.wallController = new WallController({
      scene: this.sceneController,
      roomController: this.roomController,
    });
  }

  run() {
    this.database.init(() => {
      this.database.get((res) => {
        // this.sceneController.loadFromSchemas(res.objects);

        this.sceneController.model.objects;
        this.event.emit("scene_update");
        this.sceneController.view.animate();
      });
    });

    //test
    let cornerProps: Object3DProps = {
      position: { x: 0, y: 0, z: 0 },
      rotation: { w: 0, x: 0, y: 0, z: 0 },
      uuid: Helpers.uuid(),
      dimension: { width: 0.1, depth: 1, height: 1 },
    };

    let corner1 = new Corner({
      ...cornerProps,
      position: { x: 0, y: 0, z: 0 },
    });
    let corner2 = new Corner({
      ...cornerProps,
      position: { x: 4, y: 0, z: 0 },
    });
    let corner3 = new Corner({
      ...cornerProps,
      position: { x: 2, y: 0, z: 2 },
    });
    let corner4 = new Corner({
      ...cornerProps,
      position: { x: 0, y: 0, z: 2 },
    });

    let room = new Room({
      position: { x: 0, y: 0, z: 0 },
      rotation: { w: 0, x: 0, y: 0, z: 0 },
      uuid: Helpers.uuid(),
      dimension: { width: 0, height: 0, depth: 0 },
    });

    room.corners.push(corner1, corner2, corner3, corner4);

    // this.sceneController.model.addObject(corner1);
    // this.sceneController.model.addObject(corner2);
    // this.sceneController.model.addObject(corner3);
    // this.sceneController.model.addObject(corner4);
    // this.sceneController.model.addObject(room);

    this.sceneController.event.emit("scene_update");
  }

  save() {
    let objects = this.sceneController.model.objects.map((object) => {
      return object.toJson();
    });

    this.database.set(
      {
        objects: objects,
      },
      () => {
        console.log("saved");
      }
    );
  }

  reset() {
    this.database.clearObjects(() => {
      console.log("cleared");
    });
  }
}

export { App };

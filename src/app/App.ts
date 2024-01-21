import { Scene as SceneController } from "./controller/Scene";
import { Pipe as PipeController } from "../app/controller/Pipe";
import { Wall as WallController } from "../app/controller/Wall";
import { Room as RoomController } from "../app/controller/Room";
import { Graph as GraphController } from "../app/controller/Graph";
import { EventSystem, Database, Object3D, Storage } from "./system";
import { Corner } from "./model";

class App {
  database: Database = new Database();
  event: EventSystem = new EventSystem();
  active: Object3D | null = null;

  graphController: GraphController;
  sceneController: SceneController;
  wallController: WallController;
  pipeController: PipeController;
  roomController: RoomController;

  constructor(props: { canvas: HTMLElement | null }) {
    this.sceneController = new SceneController(props);

    this.graphController = new GraphController();

    this.roomController = new RoomController({
      scene: this.sceneController,
      graph: this.graphController,
    });
    this.pipeController = new PipeController({
      scene: this.sceneController,
    });
    this.wallController = new WallController({
      scene: this.sceneController,
      roomController: this.roomController,
    });
  }

  init(): Promise<unknown> {
    return new Promise((resolve, reject) => {
      this.database.init(() => {
        this.database.get((res) => {
          Storage.init().then(() => {
            this.sceneController.model.objects;
            this.event.emit("scene_update");
            resolve("");
          });
        });
      });
    });
  }

  run() {
    this.sceneController.view?.animate();
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
      },
    );
  }

  reset() {
    this.database.clearObjects(() => {
      console.log("cleared");
    });
  }
}

export { App };

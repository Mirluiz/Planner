import { Corner, Room as RoomModel } from "../model";
import { Room as RoomView } from "../view/Room";
import { Helpers } from "../system";
import { Vector3 } from "three";
import { Controller } from "./Controller";
import { Base } from "./Base";
import { App } from "../App";
import { Scene as SceneController } from "./Scene";

class Room extends Base implements Controller {
  model: RoomModel | null = null;
  view: RoomView | null = null;

  constructor(
    readonly app: App,
    readonly sceneController: SceneController,
  ) {
    super(app, sceneController);

    this.model = new RoomModel();
    this.view = new RoomView(this.model);
  }

  create(props: { [key: string]: any }) {
    return this.model;
  }
  update(props: { [key: string]: any }) {
    return this.model;
  }
  remove() {}

  reset() {}

  get rooms() {
    return this.sceneController.model.objects.filter(
      (obj): obj is RoomModel => {
        return obj instanceof RoomModel;
      },
    );
  }

  updateByCorners(corners: Array<Array<Corner>>) {
    this.sceneController.model.objects.map((obj) => {
      if (obj instanceof RoomModel) {
        // obj.destroy();
      }
    });

    this.sceneController.model.objects =
      this.sceneController.model.objects.filter((obj): obj is RoomModel => {
        return !(obj instanceof RoomModel);
      });

    corners.map((roomCorners) => {
      let newRoom = new RoomModel({
        position: { x: 0, y: 0, z: 0 },
        rotation: { w: 0, x: 0, y: 0, z: 0 },
        uuid: Helpers.uuid(),
        dimension: { width: 0, height: 0, depth: 0 },
      });

      roomCorners.map((_c) => {
        newRoom.corners.push(_c);
      });

      newRoom.triangulation = this.getTriangles(roomCorners);

      this.sceneController.model.addObject(newRoom);
    });
  }

  private getTriangles(corners: Corner[]) {
    let vertices = corners.map((corner) => {
      return {
        uuid: corner.uuid,
        position: { x: corner.position.x, y: 0, z: corner.position.z },
        isVertex: true,
      };
    });

    // return Polygon.getTriangles(vertices, this.graph);
    return [];
  }

  private angleBetweenVectorsWithOrientation(
    vectorA: Vector3,
    vectorB: Vector3,
  ) {
    const crossProduct = vectorA.x * vectorB.z - vectorA.z * vectorB.x;
    const dotProduct = vectorA.x * vectorB.x + vectorA.z * vectorB.z;

    const angleRadians = Math.atan2(crossProduct, dotProduct);

    return angleRadians;
  }
}

export { Room };

import { Corner, Wall as WallModel } from "../model";
import { Graph, Helpers, Math2D, Object3DProps } from "../system";
import { Scene as SceneController } from "./Scene";
import { Room as RoomModel } from "./../model/Room";
import { Polygon } from "../system/utils/Polygon";

class Room {
  readonly scene: SceneController;

  constructor(props: { scene: SceneController }) {
    this.scene = props.scene;
  }

  get rooms() {
    return this.scene.model.objects.filter((obj): obj is RoomModel => {
      return obj instanceof RoomModel;
    });
  }

  updateByCorners(corners: Array<Array<Corner>>, graph: Graph) {
    this.scene.model.objects.map((obj) => {
      if (obj instanceof RoomModel) {
        obj.destroy();
      }
    });

    this.scene.model.objects = this.scene.model.objects.filter(
      (obj): obj is RoomModel => {
        return !(obj instanceof RoomModel);
      }
    );

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
      newRoom.triangulation = Polygon.getTriangles(roomCorners, graph);

      this.scene.model.addObject(newRoom);
    });
  }
}

export { Room };

import { Corner, Room as RoomModel, Wall as WallModel } from "../model";
import { Room as RoomView } from "../view/Room";
import { Helpers } from "../system";
import { Scene as SceneModel } from "../model/Scene";
import { Graph as GraphController } from "./Graph";
import { Polygon } from "../system/utils/Polygon";
import { Vector3 } from "three";
import { Controller } from "./Controller";
import { Base } from "./Base";
import { App } from "../App";
import { Scene as SceneController } from "./Scene";
import { Wall as WallView } from "../view";

class Room extends Base<RoomModel, RoomView> implements Controller {
  // constructor(props: { scene: SceneModel }) {
  //   this.scene = props.scene;
  //   this.graph = new GraphController();
  // }
  constructor(readonly app: App, readonly sceneController: SceneController) {
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
      }
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

  updateGraph() {
    // this.graph.graph = {};
    // this.graph.vertices = {};
    //
    // let walls = this.scene.objects.filter(
    //   (obj): obj is WallModel => obj instanceof WallModel
    // );
    //
    // let corners = this.scene.objects.filter(
    //   (obj): obj is Corner => obj instanceof Corner
    // );
    //
    // walls.map((wall) => {
    //   let from: Corner | undefined = corners.find((obj): obj is Corner =>
    //     obj.walls.some((w) => w.uuid === wall.uuid)
    //   );
    //   let to: Corner | undefined = corners.find(
    //     (obj): obj is Corner =>
    //       obj.walls.some((w) => w.uuid === wall.uuid) && obj.uuid !== from?.uuid
    //   );
    //
    //   if (from && to) {
    //     this.graph?.addEdge(
    //       { uuid: from.uuid, position: from.position },
    //       { uuid: to.uuid, position: to.position }
    //     );
    //   }
    // });
    //
    // if (!this.graph) return;
    //
    // let cycles = this.graph.getCycles();
    //
    // let roomCorners: Array<Array<Corner>> = [];
    //
    // cycles.map((cycle) => {
    //   let _corners: Array<Corner> = [];
    //   let vectors: Array<Vector3> = [];
    //
    //   cycle.map((uuid) => {
    //     let corner: Corner | undefined = corners.find(
    //       (obj): obj is Corner => obj.uuid === uuid
    //     );
    //
    //     if (corner) {
    //       _corners.push(corner);
    //       vectors.push(
    //         new Vector3(corner.position.x, corner.position.y, corner.position.z)
    //       );
    //     }
    //   });
    //
    //   roomCorners.push(_corners);
    // });
    //
    // this.updateByCorners(roomCorners);
  }

  private angleBetweenVectorsWithOrientation(
    vectorA: Vector3,
    vectorB: Vector3
  ) {
    const crossProduct = vectorA.x * vectorB.z - vectorA.z * vectorB.x;
    const dotProduct = vectorA.x * vectorB.x + vectorA.z * vectorB.z;

    const angleRadians = Math.atan2(crossProduct, dotProduct);

    return angleRadians;
  }
}

export { Room };

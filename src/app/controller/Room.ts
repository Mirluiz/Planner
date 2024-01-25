import { Corner, Wall as WallModel } from "../model";
import { Helpers } from "../system";
import { Scene as SceneController } from "./Scene";
import { Scene as SceneModel } from "../model/Scene";
import { Room as RoomModel } from "./../model/Room";
import { Graph as GraphController } from "./Graph";
import { Polygon } from "../system/utils/Polygon";
import { Vector3 } from "three";
import { Controller } from "./Controller";

class Room implements Controller {
  readonly scene: SceneModel;

  activeModel: RoomModel | null = null;

  constructor(props: { scene: SceneModel }) {
    this.scene = props.scene;
  }

  create(props: { [key: string]: any }) {
    return this.activeModel;
  }
  update(props: { [key: string]: any }) {
    return this.activeModel;
  }
  remove() {}

  reset() {}

  get rooms() {
    return this.scene.objects.filter((obj): obj is RoomModel => {
      return obj instanceof RoomModel;
    });
  }

  updateByCorners(corners: Array<Array<Corner>>) {
    this.scene.objects.map((obj) => {
      if (obj instanceof RoomModel) {
        // obj.destroy();
      }
    });

    this.scene.objects = this.scene.objects.filter((obj): obj is RoomModel => {
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

      // roomCorners.map((value, index, array) => {
      //   let middleCorner = array[(index + 1) % array.length];
      //   let nextCorner = array[(index + 2) % array.length];
      //
      //   let toMiddleWall: WallModel | undefined;
      //   let toNextWall: WallModel | undefined;
      //
      //   value.walls.map((wall) => {
      //     let _w = middleCorner.walls.find((w) => w.uuid === wall.uuid);
      //     if (_w) {
      //       toMiddleWall = _w;
      //     }
      //   });
      //
      //   middleCorner.walls.map((wall) => {
      //     let _w = nextCorner.walls.find((w) => w.uuid === wall.uuid);
      //     if (_w) {
      //       toNextWall = _w;
      //     }
      //   });
      //
      //   if (toNextWall && toMiddleWall) {
      //     let v0 = new Vector3(
      //       value.position.x,
      //       value.position.y,
      //       value.position.z
      //     );
      //     let v1 = new Vector3(
      //       middleCorner.position.x,
      //       middleCorner.position.y,
      //       middleCorner.position.z
      //     );
      //     let v2 = new Vector3(
      //       nextCorner.position.x,
      //       nextCorner.position.y,
      //       nextCorner.position.z
      //     );
      //
      //     let angle = angleBetweenVectorsWithOrientation(
      //       v0.clone().sub(v1),
      //       v2.clone().sub(v1)
      //     );
      //
      //     middleCorner.walls.map((wall) => {
      //       if (
      //         wall.connections.start instanceof Corner &&
      //         wall.connections.end instanceof Corner
      //       ) {
      //         // toMiddleWall.endAngle = -angle / 2;
      //         if (wall.connections.end.uuid === middleCorner.uuid) {
      //           wall.endAngle = -angle / 2;
      //         } else if (wall.connections.start.uuid === middleCorner.uuid) {
      //           wall.startAngle = -angle / 2;
      //         }
      //       }
      //     });
      //
      //     // toNextWall.startAngle = -angle / 2;
      //     console.log("toNextWall.startAngle", toNextWall.startAngle);
      //   }
      // });

      // newRoom.triangulation = this.getTriangles(roomCorners);

      this.scene.addObject(newRoom);
    });
  }

  private getTriangles(corners: Corner[]) {
    // let vertices = corners.map((corner) => {
    //   return {
    //     uuid: corner.uuid,
    //     position: { x: corner.position.x, y: 0, z: corner.position.z },
    //     isVertex: true,
    //   };
    // });
    //
    // return Polygon.getTriangles(vertices, this.graph);
  }

  updateGraph() {
    // this.graph.graph = {};
    // this.graph.vertices = {};
    //
    // let walls = this.scene.model.objects.filter(
    //   (obj): obj is WallModel => obj instanceof WallModel
    // );
    //
    // let corners = this.scene.model.objects.filter(
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
}

export { Room };

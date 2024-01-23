import { Corner, Wall as WallModel } from "../model";
import { Helpers, Math2D, Object3DProps } from "../system";
import { Scene as SceneController } from "./Scene";
import { Room as RoomModel } from "./../model/Room";
import { Graph as GraphController } from "./Graph";
import { Polygon } from "../system/utils/Polygon";
import { Vector3 } from "three";

class Room {
  readonly scene: SceneController;
  readonly graph: GraphController;

  constructor(props: { scene: SceneController; graph: GraphController }) {
    this.scene = props.scene;
    this.graph = props.graph;
  }

  get rooms() {
    return this.scene.model.objects.filter((obj): obj is RoomModel => {
      return obj instanceof RoomModel;
    });
  }

  updateByCorners(corners: Array<Array<Corner>>) {
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

      newRoom.triangulation = this.getTriangles(roomCorners);

      this.scene.model.addObject(newRoom);
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

    return Polygon.getTriangles(vertices, this.graph);
  }
}

export { Room };

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
  readonly graph: GraphController;

  activeModel: RoomModel | null = null;

  constructor(props: { scene: SceneModel }) {
    this.scene = props.scene;
    this.graph = new GraphController();
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

      newRoom.triangulation = this.getTriangles(roomCorners);

      this.scene.addObject(newRoom);
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

  updateGraph() {
    this.graph.graph = {};
    this.graph.vertices = {};

    let walls = this.scene.objects.filter(
      (obj): obj is WallModel => obj instanceof WallModel
    );

    let corners = this.scene.objects.filter(
      (obj): obj is Corner => obj instanceof Corner
    );

    walls.map((wall) => {
      let from: Corner | undefined = corners.find((obj): obj is Corner =>
        obj.walls.some((w) => w.uuid === wall.uuid)
      );
      let to: Corner | undefined = corners.find(
        (obj): obj is Corner =>
          obj.walls.some((w) => w.uuid === wall.uuid) && obj.uuid !== from?.uuid
      );

      if (from && to) {
        this.graph?.addEdge(
          { uuid: from.uuid, position: from.position },
          { uuid: to.uuid, position: to.position }
        );
      }
    });

    if (!this.graph) return;

    let cycles = this.graph.getCycles();

    let roomCorners: Array<Array<Corner>> = [];

    cycles.map((cycle) => {
      let _corners: Array<Corner> = [];
      let vectors: Array<Vector3> = [];

      cycle.map((uuid) => {
        let corner: Corner | undefined = corners.find(
          (obj): obj is Corner => obj.uuid === uuid
        );

        if (corner) {
          _corners.push(corner);
          vectors.push(
            new Vector3(corner.position.x, corner.position.y, corner.position.z)
          );
        }
      });

      roomCorners.push(_corners);
    });

    this.updateByCorners(roomCorners);
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

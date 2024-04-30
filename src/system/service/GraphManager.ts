import { Graph } from "../utils/Graph";
import { Corner, Wall as WallModel } from "../../app/model";
import { Vector3 } from "three";
import { App } from "../../app/App";

class GraphManager {
  graph: Graph;

  constructor(readonly app: App) {
    this.graph = new Graph();
  }

  update() {
    this.graph.graph = {};
    this.graph.vertices = {};

    let { model } = this.app.sceneController;

    let walls = model.objects.filter(
      (obj): obj is WallModel => obj instanceof WallModel,
    );

    let corners = model.objects.filter(
      (obj): obj is Corner => obj instanceof Corner,
    );

    walls.map((wall) => {
      let from: Corner | undefined = corners.find((obj): obj is Corner =>
        obj.walls.some((w) => w === wall.uuid),
      );
      let to: Corner | undefined = corners.find(
        (obj): obj is Corner =>
          obj.walls.some((w) => w === wall.uuid) && obj.uuid !== from?.uuid,
      );

      if (from && to) {
        this.graph?.addEdge(
          { uuid: from.uuid, position: from.position },
          { uuid: to.uuid, position: to.position },
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
          (obj): obj is Corner => obj.uuid === uuid,
        );

        if (corner) {
          _corners.push(corner);
          vectors.push(
            new Vector3(
              corner.position.x,
              corner.position.y,
              corner.position.z,
            ),
          );
        }
      });

      roomCorners.push(_corners);
    });

    this.app.roomController.updateByCorners(roomCorners);
  }
}

export { GraphManager };

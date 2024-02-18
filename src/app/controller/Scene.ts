import { Scene as SceneModel } from "../model/Scene";
import { EventSystem } from "../system";
import { Scene as SceneView } from "../view/Scene";

import { App } from "../App";
import { Controller } from "./Controller";
import { Vector3 } from "three";

class Scene {
  model: SceneModel;
  view: SceneView | null = null;
  event: EventSystem = new EventSystem();
  activeController: Controller | null = null;

  constructor(
    props: { canvas: HTMLElement | null },
    readonly app: App,
  ) {
    this.model = new SceneModel();

    if (props.canvas) {
      this.view = new SceneView({
        canvas: props.canvas,
        controller: this,
      });

      this.initListeners();
    }
  }

  private initListeners() {
    this.view?.engine?.htmlElement?.addEventListener("mousedown", (event) => {
      this.activeController?.mouseDown(this.view!.engine!.groundInters);
    });

    this.view?.engine?.htmlElement?.addEventListener("mouseup", () => {
      this.activeController?.mouseUp(this.view!.engine!.groundInters);
    });

    this.view?.engine?.htmlElement?.addEventListener("mousemove", () => {
      this.activeController?.mouseMove(this.view!.engine!.groundInters);
    });

    this.view?.engine?.htmlElement?.addEventListener("keydown", (event) => {
      if (event.code == "Escape") {
        this.activeController?.reset();
        this.activeController = null;
      }
    });
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
}

export { Scene };

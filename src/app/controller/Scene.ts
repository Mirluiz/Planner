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
}

export { Scene };

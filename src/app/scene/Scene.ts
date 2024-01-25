import * as THREE from "three";
import { Scene as SceneController } from "./../controller/Scene";
import { Scene as THREEScene } from "./../system/engine/THREE/Scene";
import { Room } from "../model";
import { App } from "../App";
import { Object3D } from "../system";
import { Controller } from "../controller/Controller";
import { Vector3 } from "three";

class Scene {
  controller: App["sceneController"];
  model: App["sceneController"]["model"];

  mode: "draw" | null = null;
  activeController: Controller | null = null;

  engine: THREEScene;
  dragElement: Object3D | null = null;

  constructor(props: { canvas: HTMLElement; controller: SceneController }) {
    this.model = props.controller.model;
    this.controller = props.controller;
    this.engine = new THREEScene(props);

    this.initListeners();
  }

  private initListeners() {
    this.engine.htmlElement?.addEventListener("mousedown", (event) => {
      this.engine.onPointerMove(event);

      if (this.mode) {
        let object = this.activeController?.create({
          ...this.engine.groundInters,
        });

        object?.notifyObservers();
      } else {
        this.model.objects.map((element) => {
          if (element instanceof Room) {
            element.focused = false;
          }
        });

        this.model.intersects.map((intersect) => {
          if (intersect.object instanceof Room) {
            intersect.object.focused = true;
          }
        });

        this.dragElement = this.model.intersects[0]?.object ?? null;
      }

      this.controller.event.emit("scene_update");
    });

    this.engine.htmlElement?.addEventListener("mouseup", () => {
      if (this.dragElement) {
        this.dragElement.notifyObservers();
        this.dragElement.onUpdate();
        this.dragElement = null;
      }
    });

    this.engine.htmlElement?.addEventListener("mousemove", (event) => {
      this.engine.onPointerMove(event);
      this.updateIntersection(this.engine.intersects);

      if (!this.mode) {
        if (this.dragElement) {
          this.dragElement.position.x = this.engine.groundInters.x;
          this.dragElement.position.y = this.engine.groundInters.y;
          this.dragElement.position.z = this.engine.groundInters.z;

          this.dragElement.onUpdate();
          this.dragElement.notifyObservers();
        }
      } else {
        let object = this.activeController?.update({
          ...this.engine.groundInters,
        });

        object?.notifyObservers();
      }
    });

    this.engine.htmlElement?.addEventListener("keydown", (event) => {
      if (event.code == "Escape") {
        this.activeController?.reset();
        this.mode = null;
        this.controller.event.emit("scene_update");
      }
    });
  }

  private updateIntersection(intersects: THREE.Intersection[]) {
    this.controller.model.objects.map((model) => {
      model.hovered = false;
    });

    let intersections: Array<{
      position: Vector3;
      object: Object3D;
    }> = [];

    intersects.map((intersect) => {
      if (intersect.object.userData.object?.model?.active) {
        return;
      }

      if (intersect.object.userData.object) {
        intersections.push({
          object: intersect.object.userData.object.model,
          position: intersect.point,
        });
      }
    });

    let intersect = intersects[0];
    if (
      intersect &&
      this.isObject3D(intersect.object.userData?.object?.model)
    ) {
      intersect.object.userData.object.model.hovered = true;
    }

    this.model.intersects = intersections;
  }

  isObject3D(object: any): object is Object3D {
    return object && "uuid" in object;
  }
}

export { Scene };

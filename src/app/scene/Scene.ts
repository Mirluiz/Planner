import * as THREE from "three";
import { Scene as SceneController } from "./../controller/Scene";
import { Scene as THREEScene } from "./../system/engine/THREE/Scene";
import { Room, Wall } from "../model";
import { App } from "../App";
import { Object3D } from "../system";
import { Controller } from "../controller/Controller";
import { Vector3 } from "three";
import { Mesh } from "../system/engine/THREE/Mesh";

class Scene {
  controller: App["sceneController"];
  model: App["sceneController"]["model"];

  mode: "draw" | null = null;
  activeController: Controller | null = null;

  engine: THREEScene;
  dragElement: {
    position: Vector3;
    object: Mesh;
    initialData: { position: Vector3 };
  } | null = null;

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
          if (intersect.object.model instanceof Room) {
            intersect.object.model.focused = true;
          }
        });

        this.dragElement =
          {
            object: this.model.intersects[0]?.object,
            position: this.model.intersects[0].position.clone(),
            initialData: {
              position: new Vector3(
                this.engine.groundInters.x,
                this.engine.groundInters.y,
                this.engine.groundInters.z
              ),
            },
          } ?? null;

        if (this.dragElement?.object?.model) {
          this.dragElement.object.model.focused = true;
        }

        // this.dragElement =
        //   {
        //     ...this.model.intersects[0],
        //     initialData: {
        //       position: new Vector3(
        //         this.engine.groundInters.x,
        //         this.engine.groundInters.y,
        //         this.engine.groundInters.z
        //       ),
        //     },
        //   } ?? null;
        //
        // if (this.dragElement?.object?.userData?.model) {
        //   this.dragElement.object.userData.model.focused = true;
        // }
      }

      this.controller.event.emit("scene_update");
    });

    this.engine.htmlElement?.addEventListener("mouseup", () => {
      if (this.dragElement) {
        // this.dragElement.object.focused = false;
        // this.dragElement.object.notifyObservers();
        // this.dragElement.onUpdate();
        this.dragElement = null;
      }
    });

    this.engine.htmlElement?.addEventListener("mousemove", (event) => {
      this.engine.onPointerMove(event);
      this.updateIntersection(this.engine.intersects);

      if (!this.mode) {
        if (this.dragElement) {
          let diff = new Vector3(
            this.engine.mouseDownPosition.x - this.engine.groundInters.x,
            this.engine.mouseDownPosition.y - this.engine.groundInters.y,
            this.engine.mouseDownPosition.z - this.engine.groundInters.z
          );

          let updatedPosition = this.dragElement.initialData.position
            .clone()
            .sub(diff);

          this.dragElement.object.update({ position: updatedPosition });
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
      object: Mesh;
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

    let intersect = intersections[0];
    if (intersect) {
      intersect.object.model.hovered = true;
    }

    this.model.intersects = intersections;
  }

  isObject3D(object: any): object is Object3D {
    return object && "uuid" in object;
  }
}

export { Scene };

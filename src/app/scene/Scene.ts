import * as THREE from "three";
import { Scene as SceneController } from "./../controller/Scene";
import { Scene as THREEScene } from "./../system/engine/THREE/Scene";
import { Room, Wall } from "../model";
import { App } from "../App";
import { Object3D } from "../system";
import { Controller } from "../controller/Controller";
import { Vector3 } from "three";
import { BaseMesh, Mesh } from "../system/engine/THREE/Mesh";

class Scene {
  controller: App["sceneController"];
  model: App["sceneController"]["model"];

  mode: "draw" | null = null;
  activeController: Controller | null = null;

  private mousePressed: boolean = false;

  engine: THREEScene;
  focusedElement: {
    centerOffset: Vector3;
    position: Vector3;
    object: Mesh;
    initialData: { position: Vector3 };
  } | null = null;
  dragElement: {
    centerOffset: Vector3;
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
      this.mousePressed = true;

      if (this.mode) {
        let object = this.activeController?.create({
          ...this.engine.groundInters,
        });

        object?.notifyObservers();
      } else {
        this.model.objects.map((element) => {
          element.focused = false;
        });

        this.model.intersects.map((intersect) => {
          intersect.object.model.focused = false;
        });

        this.updateFocusedObject();
      }

      this.controller.event.emit("scene_update");
      this.controller.model.event.emit("objects_updated");
    });

    this.engine.htmlElement?.addEventListener("mouseup", () => {
      this.mousePressed = false;
      let intersection = this.model.intersects[0];

      if (this.dragElement?.object) {
        this.dragElement.object.model.focused = false;
        this.dragElement.object.model.notifyObservers();
        this.dragElement = null;
      } else {
        if (intersection && !this.mode) {
          intersection.object.model.focused = true;
          this.controller.model.event.emit("objects_updated");
        }
      }
    });

    this.engine.htmlElement?.addEventListener("mousemove", (event) => {
      this.engine.onPointerMove(event);
      this.updateIntersection(this.engine.intersects);

      if (this.mousePressed && this.focusedElement) {
        this.updateDraggedObject();

        let diff = new Vector3(
          this.engine.mouseDownPosition.x - this.engine.groundInters.x,
          this.engine.mouseDownPosition.y - this.engine.groundInters.y,
          this.engine.mouseDownPosition.z - this.engine.groundInters.z
        );

        let updatedPosition = this.dragElement?.initialData.position
          .clone()
          .sub(diff);

        this.dragElement?.object?.update({
          position: updatedPosition,
          meshIntersectionPosition: this.dragElement.centerOffset,
        });
        this.dragElement?.object.model.notifyObservers();
      }

      if (!this.mode) {
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

      if (this.isBaseMesh(intersect.object?.userData?.object)) {
        intersections.push({
          object: intersect.object.userData.object,
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

  private updateFocusedObject() {
    this.focusedElement = null;
    let intersection = this.model.intersects[0];
    let ground = new Vector3(
      this.engine.groundInters.x,
      this.engine.groundInters.y,
      this.engine.groundInters.z
    );

    if (intersection?.object?.model) {
      this.focusedElement =
        {
          centerOffset: ground
            .clone()
            .sub(
              new Vector3(
                intersection.object.model.position.x,
                intersection.object.model.position.y,
                intersection.object.model.position.z
              )
            ),
          object: intersection.object,
          position: intersection.position.clone(),
          initialData: {
            position: ground,
          },
        } ?? null;
    }
  }

  private updateDraggedObject() {
    if (this.focusedElement) {
      this.dragElement = {
        centerOffset: this.focusedElement.centerOffset.clone(),
        object: this.focusedElement.object,
        position: this.focusedElement.position.clone(),
        initialData: {
          position: this.focusedElement.initialData.position.clone(),
        },
      };
    }
  }

  isBaseMesh(object: any): object is Mesh {
    return object && "isBaseMesh" in object;
  }
}

export { Scene };

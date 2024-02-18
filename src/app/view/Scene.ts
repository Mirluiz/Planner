import * as THREE from "three";
import { Scene as SceneController } from "./../controller/Scene";
import { Scene as THREEScene } from "./../system/engine/THREE/Scene";
import { App } from "../App";
import { Vector3 } from "three";
import { BaseMesh, Mesh } from "../system/engine/THREE/Mesh";

class Scene {
  controller: App["sceneController"];
  model: App["sceneController"]["model"];

  mode: "draw" | null = null;

  mousePressed: boolean = false;

  engine: THREEScene | null = null;

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
    this.engine?.htmlElement?.addEventListener("mousedown", (event) => {
      if (!this.engine) return;

      this.engine?.onPointerMove(event);
      if (event.button === 0) {
        this.mousePressed = true;

        this.model.intersects.map((intersect) => {
          intersect.object.focused = false;
        });

        this.updateFocusedObject();

        this.controller.model.event.emit("objects_updated");
      }
    });

    this.engine?.htmlElement?.addEventListener("mouseup", () => {
      if (!this.engine) return;

      this.mousePressed = false;
      let intersection = this.model.intersects[0];

      if (this.dragElement?.object) {
        this.dragElement.object.focused = false;
        this.dragElement.object.model?.notifyObservers();
        this.dragElement = null;
      } else {
        if (intersection && !this.mode) {
          intersection.object.focused = true;
          this.controller.model.event.emit("objects_updated");
        }
      }
    });

    this.engine?.htmlElement?.addEventListener("mousemove", (event) => {
      if (!this.engine) return;

      this.engine.onPointerMove(event);
      this.updateIntersection(this.engine.intersects);

      if (this.mousePressed && this.focusedElement) {
        this.updateDraggedObject();

        let diff = new Vector3(
          this.engine.mouseDownPosition.x - this.engine.groundInters.x,
          this.engine.mouseDownPosition.y - this.engine.groundInters.y,
          this.engine.mouseDownPosition.z - this.engine.groundInters.z,
        );

        let updatedPosition = this.dragElement?.initialData.position
          .clone()
          .sub(diff);

        if (this.engine.netBinding && updatedPosition) {
          updatedPosition.x = +(updatedPosition.x / 10).toFixed(1) * 10;
          updatedPosition.z = +(updatedPosition.z / 10).toFixed(1) * 10;
        }

        this.dragElement?.object?.update({
          position: updatedPosition,
          meshIntersectionPosition: this.dragElement.centerOffset,
        });
        this.dragElement?.object.model?.notifyObservers();
      }
    });

    this.engine?.htmlElement?.addEventListener("keydown", (event) => {
      if (event.code == "Escape") {
        console.log("esc pressed");
      }
    });
  }

  private updateIntersection(intersects: THREE.Intersection[]) {
    let intersections: Array<{
      position: Vector3;
      object: Mesh;
    }> = [];

    this.engine?.scene.children.map((child) => {
      if (this.isBaseMesh(child.userData?.object)) {
        child.userData.object.hovered = false;
      }
    });

    intersects.map((intersect) => {
      if (intersect.object.userData.object?.temporary) {
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
      intersect.object.hovered = true;
    }

    this.model.intersects = intersections;
  }

  private updateFocusedObject() {
    this.focusedElement = null;
    let intersection = this.model.intersects[0];
    let ground = new Vector3(
      this.engine?.groundInters.x,
      this.engine?.groundInters.y,
      this.engine?.groundInters.z,
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
                intersection.object.model.position.z,
              ),
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

import * as THREE from "three";
import { Scene as SceneController } from "./../controller/Scene";
import { Scene as THREEScene } from "../../system/engine/THREE/Scene";
import { App } from "../App";
import { Vector3 } from "three";
import { BaseMesh, Mesh } from "../../system/engine/THREE/Mesh";
import { Drag, Intersection, Focus } from "../../system";

class Scene {
  controller: App["sceneController"];
  model: App["sceneController"]["model"];

  intersection: Intersection;
  focus: Focus;

  mouseDragged: boolean = false;
  mousePressed: boolean = false;

  engine: THREEScene | null = null;

  activeElement: Mesh | null = null;

  constructor(props: { canvas: HTMLElement; controller: SceneController }) {
    this.model = props.controller.model;
    this.controller = props.controller;
    this.engine = new THREEScene(props);

    this.initListeners();

    this.intersection = new Intersection(this.engine);
    this.focus = new Focus();
  }

  private initListeners() {
    this.engine?.htmlElement?.addEventListener("mousedown", (event) => {
      if (!this.engine) return;

      this.engine?.onPointerMove(event);

      if (event.button === 0) {
        this.mousePressed = true;
        this.focus.update();
      }
    });

    this.engine?.htmlElement?.addEventListener("mousemove", (event) => {
      if (!this.engine) return;

      this.engine.onPointerMove(event);
      this.intersection.update(this.engine.intersects);

      if (this.mousePressed) {
        this.mouseDragged = true;

        if (this.intersection.priorityObject && !this.activeElement) {
          let { priorityObject } = this.intersection;

          this.activeElement = priorityObject.object;

          this.activeElement.drag({
            position: new Vector3(
              this.engine.groundInters.x,
              this.engine.groundInters.y,
              this.engine.groundInters.z,
            ),
          });
        } else {
          this.activeElement?.drag({
            position: new Vector3(
              this.engine.groundInters.x,
              this.engine.groundInters.y,
              this.engine.groundInters.z,
            ),
          });
        }
      }
    });

    this.engine?.htmlElement?.addEventListener("mouseup", () => {
      if (!this.engine) return;

      if (!this.mouseDragged) {
        this.intersection.objects[0]?.object.onFocus();
      } else {
        let { priorityObject } = this.intersection;
        if (priorityObject) {
          priorityObject.object.dragEnd();
        }
      }

      this.activeElement = null;
      this.mousePressed = false;
      this.mouseDragged = false;
    });

    this.engine?.htmlElement?.addEventListener("keydown", (event) => {
      if (event.code == "Escape") {
        this.engine?.scene.children.map((child) => {
          if (this.isBaseMesh(child.userData?.object)) {
            if (child.userData.object.focused) {
              child.userData.object.focused = false;
              child.userData.object.onFocusEnd();
            }
          }
        });
      }
    });

    this.engine?.htmlElement?.addEventListener("dblclick", () => {
      let { priorityObject } = this.intersection;

      if (priorityObject) {
        priorityObject.object.focused = true;
        priorityObject.object.reRender2D();
        this.controller.model.event.emit("objects_updated");
      }
    });
  }

  private isBaseMesh(object: any): object is Mesh {
    return object && "isBaseMesh" in object;
  }
}

export { Scene };

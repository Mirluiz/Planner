import { Scene as SceneModel } from "../model/Scene";
import { Corner, Fitting, Pipe, Radiator, Wall } from "../model";
import {
  EventSystem,
  Drawing,
  Entity,
  Object3DSchema,
  Object3D,
} from "../system";
import { Scene as SceneView } from "../scene/Scene";
import { Room } from "../model/Room";
import { Vector3 } from "three";

class Scene {
  model: SceneModel;
  view: SceneView | null = null;
  event: EventSystem = new EventSystem();

  activeController: Drawing | null = null;
  draggedObject: Object3D | null = null;

  constructor(props: { canvas: HTMLElement | null }) {
    this.model = new SceneModel();

    if (props.canvas) {
      this.view = new SceneView({ canvas: props.canvas, controller: this });

      this.view.engine.onRender = (intersections) => {
        // console.log("===");
        this.updateIntersection(intersections);
      };
    }

    this.initListeners();
  }

  setDrawMode(m: "wall" | "pipe" | "object" | null) {
    this.model.drawMode = m;
  }

  private initListeners() {
    this.view?.engine.htmlElement?.addEventListener("mousedown", (event) => {
      if (!this.view) return;

      if (this.model.drawMode) {
        this.activeController?.startDraw({
          ...this.view?.engine.groundInters,
        });
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

        this.draggedObject = this.model.intersects[0]?.object ?? null;
      }

      this.event.emit("scene_update");
    });

    this.view?.engine.htmlElement?.addEventListener("mouseup", () => {
      if (this.draggedObject) {
        this.draggedObject = null;
      }
    });

    this.view?.engine.htmlElement?.addEventListener("mousemove", (event) => {
      if (!this.view) return;

      if (this.model.drawMode) {
        this.activeController?.draw(this.view?.engine.groundInters);
      }

      // console.log("this.draggedObject", this.draggedObject);
      if (this.draggedObject) {
        this.draggedObject.position.x = this.view.engine.groundInters.x;
        this.draggedObject.position.y = this.view.engine.groundInters.y;
        this.draggedObject.position.z = this.view.engine.groundInters.z;

        this.draggedObject.update();
        this.draggedObject.notifyObservers();
      }

      this.activeController?.active?.notifyObservers();
    });

    this.view?.engine.htmlElement?.addEventListener("keydown", (event) => {
      if (event.code == "Escape") {
        this.setDrawMode(null);
      }

      this.event.emit("scene_update");
    });
  }

  private updateIntersection(intersects: THREE.Intersection[]) {
    this.model.intersects.map((intersect) => {
      if (intersect.object) {
        intersect.object.hovered = false;
      }
    });

    let intersections: Array<{
      position: Vector3;
      object: Object3D;
    }> = [];

    intersects.map((intersect) => {
      if (
        this.activeController?.active?.uuid ===
        intersect.object.userData.object?.model?.uuid
      ) {
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

  loadFromSchemas(schemas: Array<Object3DSchema>) {
    schemas.map((schema, index) => {
      switch (schema.type) {
        case Entity.PIPE:
          let pipe = Pipe.fromJson(schema);

          if (pipe) this.model.addObject(pipe);
          break;
        case Entity.WALL: {
          let wall = Wall.fromJson(schema);
          if (wall) this.model.addObject(wall);
          break;
        }
        case Entity.ROOM: {
          let room = Room.fromJson(schema);
          if (room) this.model.addObject(room);
          break;
        }
        case Entity.FITTING:
          let fitting = Fitting.fromJson(schema);
          if (fitting) this.model.addObject(fitting);
          break;
        case Entity.CORNER:
          let corner = Corner.fromJson(schema);

          this.model.addObject(corner);
          break;
        case Entity.RADIATOR:
          // this.model.addObject(Radiator.fromJson(schema));
          break;
      }
    });
  }

  isObject3D(object: any): object is Object3D {
    return object && "uuid" in object;
  }
}

export { Scene };

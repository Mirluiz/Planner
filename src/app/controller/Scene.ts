import { Scene as SceneModel } from "../model/Scene";
import { Corner, Fitting, Pipe, PipeEnd, Radiator, Wall } from "../model";
import { EventSystem, Drawing, Entity, Object3DSchema } from "../system";
import { Scene as SceneView } from "../scene/Scene";
import { Room } from "../model/Room";

class Scene {
  model: SceneModel;
  view: SceneView;
  event: EventSystem = new EventSystem();

  activeController: Drawing | null = null;

  constructor(params: { canvas: HTMLElement }) {
    this.model = new SceneModel();
    this.view = new SceneView({ canvas: params.canvas, controller: this });

    this.view.onRender = (intersections) => {
      this.updateIntersection(intersections);
    };

    this.initListeners();
  }

  setDrawMode(m: "wall" | "pipe" | "object" | null) {
    this.model.drawMode = m;
  }

  private initListeners() {
    this.view.htmlElement?.addEventListener("click", (event) => {
      if (this.model.drawMode) {
        this.activeController?.startDraw(this.view.groundIntersNet);
      }

      this.event.emit("scene_update");
    });

    this.view.htmlElement?.addEventListener("mousemove", (event) => {
      if (this.model.drawMode) {
        this.activeController?.draw(this.view.groundIntersNet);
      }

      if (this.activeController?.active instanceof Wall) {
        this.event.emit("scene_update_element", this.activeController?.active);
      }
    });

    this.view.htmlElement?.addEventListener("keydown", (event) => {
      if (event.code == "Escape") {
        this.setDrawMode(null);
      }

      this.event.emit("scene_update");
    });
  }

  private updateIntersection(intersects: THREE.Intersection[]) {
    this.model.intersects = [];

    intersects.map((intersect) => {
      if (intersect.object.userData.object) {
        this.model.intersects.push({
          object: intersect.object.userData.object,
          position: intersect.point,
        });
      }
    });
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
}

export { Scene };

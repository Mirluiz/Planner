import { Scene as SceneModel } from "../model/Scene";
import { Corner, Fitting, Pipe, Wall } from "../model";
import { EventSystem, Entity, Object3DSchema, Object3D } from "../system";
import { Scene as SceneView } from "../scene/Scene";
import { Room } from "../model/Room";
import { App } from "../App";

class Scene {
  model: SceneModel;
  view: SceneView | null = null;
  event: EventSystem = new EventSystem();

  active: Object3D | null = null;

  constructor(props: { canvas: HTMLElement | null }, readonly app: App) {
    this.model = new SceneModel();

    if (props.canvas) {
      this.view = new SceneView({
        canvas: props.canvas,
        controller: this,
      });
    }
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

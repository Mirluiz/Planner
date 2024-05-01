import { Entity, EventSystem } from "../../system";
import { Object3DSchema, Object3D } from "./Object3D";
import { Pipe } from "./Pipe";
import {
  Corner,
  CornerProps,
  Door,
  DoorProps,
  Object3DSchemaWall,
  Room,
  Wall,
  Window,
} from "./Room";

class Scene {
  event: EventSystem = new EventSystem();

  private _objects: Array<Object3D> = [];
  objectsBy: { [key in string]: Object3D } = {};

  constructor() {}

  set objects(objects) {
    this._objects = objects;
    this.updateBy();
  }

  get objects() {
    return this._objects;
  }

  addObject(object: Object3D) {
    this.objects.push(object);
    this.updateBy();
    this.event.emit("objects_updated");
  }

  addSchema(schema: Object3DSchema) {
    let object = null;

    switch (schema.type) {
      case Entity.PIPE: {
        object = Pipe.fromJson(schema);
        break;
      }
      case Entity.WALL: {
        if (Scene.checkType<Object3DSchemaWall>(schema, Entity.WALL)) {
          object = Wall.fromJson(schema);
        }
        break;
      }
      case Entity.CORNER: {
        if (Scene.checkType<CornerProps>(schema, Entity.CORNER)) {
          object = Corner.fromJson(schema);
        }
        break;
      }
      case Entity.ROOM: {
        object = Room.fromJson(schema);
        break;
      }
      case Entity.DOOR: {
        if (Scene.checkType<DoorProps>(schema, Entity.DOOR)) {
          object = Door.fromJson(schema);
        }
        break;
      }
      case Entity.WINDOW: {
        object = Window.fromJson(schema);
        break;
      }
    }

    if (object) this.addObject(object);
  }

  removeObject(uuid: string) {
    let objIndex = this.objects.findIndex((object) => object.uuid === uuid);

    if (objIndex !== -1) {
      this.objects.splice(objIndex, 1);
      this.event.emit("objects_updated");
    }
  }

  static checkType<T>(params: any, typeN: number): params is T {
    return params?.type === typeN;
  }

  private updateBy() {
    this.objects.map((object) => {
      this.objectsBy[object.uuid] = object;
    });
  }
}

export { Scene };

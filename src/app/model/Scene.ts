import { Corner, Door, Pipe, Radiator, Wall } from "./";
import {
  Object3D,
  Geometry,
  EventSystem,
  Object3DSchema,
  Entity,
} from "../system";
import { Fitting } from "./Fitting";
import { Vector3 } from "three";
import { Room } from "./Room";
import { Mesh } from "../system/engine/THREE/Mesh";
import { Window } from "./Window";

class Scene {
  event: EventSystem = new EventSystem();

  _intersects: Array<{
    position: Vector3;
    object: Mesh;
  }> = [];
  objects: Array<Object3D> = [];

  constructor() {}

  set intersects(i) {
    this._intersects.map((value, index, array) => {
      value.object?.model?.notifyObservers();
    });

    this._intersects = i;
  }

  get intersects() {
    return this._intersects;
  }

  addObject(object: Object3D) {
    this.objects.push(object);

    this.event.emit("objects_updated");
  }

  addSchema(schema: Object3DSchema) {
    // console.log("schema", schema);
    switch (schema.type) {
      case Entity.PIPE: {
        let object = Pipe.fromJson(schema);
        if (object) this.addObject(object);
        break;
      }
      case Entity.WALL: {
        let object = Wall.fromJson(schema);
        if (object) this.addObject(object);
        break;
      }
      case Entity.FITTING: {
        let object = Fitting.fromJson(schema);
        if (object) this.addObject(object);
        break;
      }
      case Entity.CORNER: {
        let object = Corner.fromJson(schema);
        if (object) this.addObject(object);
        break;
      }
      case Entity.RADIATOR: {
        // let object = Radiator.fromJson()
        // this.addObject(new Radiator(schema));
        break;
      }
      case Entity.ROOM: {
        let object = Room.fromJson(schema);
        if (object) this.addObject(object);
        break;
      }
      case Entity.DOOR: {
        if ("face" in schema) {
          // let object = Door.fromJson(schema);
          // if (object) this.addObject(object);
        }

        break;
      }
      case Entity.WINDOW: {
        let object = Window.fromJson(schema);
        if (object) this.addObject(object);
        break;
      }
    }
  }

  removeObject(uuid: string) {
    let objIndex = this.objects.findIndex((object) => object.uuid === uuid);

    if (objIndex !== -1) {
      this.objects.splice(objIndex, 1);
      this.event.emit("objects_updated");
    }
  }
}

export { Scene };

import { Pipe } from "./";
import { Object3D, Geometry, EventSystem } from "../system";
import { Fitting } from "./Fitting";
import { Vector3 } from "three";
import { Room } from "./Room";

class Scene {
  drawMode: "wall" | "pipe" | "object" | null = null;
  event: EventSystem = new EventSystem();

  _intersects: Array<{
    position: Vector3;
    object: Object3D;
  }> = [];
  objects: Array<Object3D> = [];

  constructor() {}

  set intersects(i) {
    this._intersects.map((value, index, array) => {
      value.object?.notifyObservers();
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

  removeObject(uuid: string) {
    let objIndex = this.objects.findIndex((object) => object.uuid === uuid);

    this.objects.splice(objIndex, 1);

    this.event.emit("objects_updated");
  }
}

export { Scene };

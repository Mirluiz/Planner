import { Pipe } from "./";
import { Object3D, Geometry, EventSystem } from "../system";
import { Fitting } from "./Fitting";
import { Vector3 } from "three";
import { Room } from "./Room";
import { Mesh } from "../system/engine/THREE/Mesh";

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
      value.object?.model.notifyObservers();
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

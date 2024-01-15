import { Pipe } from "./";
import { Object3D, Geometry, EventSystem } from "../system";
import { Fitting } from "./Fitting";
import { Vector3 } from "three";

class Scene {
  drawMode: "wall" | "pipe" | "object" | null = null;
  event: EventSystem = new EventSystem();

  intersects: Array<{
    position: Vector3;
    object: Object3D;
  }> = [];
  objects: Array<Object3D> = [];

  constructor() {}

  addObject(object: Object3D) {
    this.objects.push(object);

    this.event.emit("objects_updated");
  }

  removeObject(uuid: string) {
    let objIndex = this.objects.findIndex((object) => object.uuid === uuid);
    console.log("objIndex", objIndex);

    this.objects.splice(objIndex, 1);

    this.event.emit("objects_updated");
  }
}

export { Scene };

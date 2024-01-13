import { Pipe } from "./";
import { Object3D, Geometry } from "../system";
import { Fitting } from "./Fitting";
import { Vector3 } from "three";

class Scene {
  drawMode: "wall" | "pipe" | "object" | null = null;

  intersects: Array<{
    position: Vector3;
    object: Object3D;
  }> = [];
  objects: Array<Object3D> = [];

  constructor() {}

  addObject(object: Object3D) {
    this.objects.push(object);
  }

  removeObject(uuid: string) {
    let objIndex = this.objects.findIndex((object) => object.uuid === uuid);

    this.objects.splice(objIndex, 1);
  }
}

export { Scene };

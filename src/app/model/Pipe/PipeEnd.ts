import { Geometry } from "../../system";
import { Vector3 } from "three";

class PipeEnd extends Vector3 {
  object: string | null = null;

  constructor(x: number, y: number, z: number) {
    super(x, y, z);
  }

  toJson() {
    return {
      object: this.object ?? undefined,
      position: { x: this.x, y: this.y, z: this.z },
    };
  }
}

export { PipeEnd };

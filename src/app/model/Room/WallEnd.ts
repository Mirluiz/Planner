import { Vector3 } from "three";
import { Corner } from "./Corner";

class WallEnd extends Vector3 {
  object: string | null = null;

  constructor(props: {
    x?: number;
    y?: number;
    z?: number;
    object?: string | null;
  }) {
    super(props.x, props.y, props.z);
    this.object = props.object ?? null;
  }

  clone(): this {
    let ret = super.clone();
    ret.object = this.object;
    ret.x = this.x;
    ret.y = this.y;
    ret.z = this.z;

    return ret;
  }
}

export { WallEnd };

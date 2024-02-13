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
    console.log("===", this, ret);
    ret.object = this.object;

    return ret;
  }
}

export { WallEnd };

import { Vector3 } from "three";
import { Corner } from "./Corner";

class WallEnd extends Vector3 {
  object: Corner | null = null;
}

export { WallEnd };

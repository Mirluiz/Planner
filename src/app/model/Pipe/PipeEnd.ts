import { Vector3 } from "three";
import { Fitting } from "../Fitting";

class PipeEnd extends Vector3 {
  object: Fitting | null = null;
}

export { PipeEnd };

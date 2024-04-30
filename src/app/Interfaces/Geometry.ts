import * as THREE from "three";

namespace Geometry {
  export class Vector3 extends THREE.Vector3 {}

  export interface Line {
    start: Vector3;
    end: Vector3;
  }
}

export { Geometry };

import * as THREE from "three";
import { Radiator as RadiatorModel } from "../../../../model";
import { BaseMesh, Mesh } from "../Mesh";
import { Observer } from "../../../interfaces/Observer";

class Radiator extends BaseMesh implements Mesh, Observer {
  constructor(private model: RadiatorModel) {
    super();

    model.addObserver(this);
  }

  update() {}

  render() {
    return this.mesh;
  }
}

export { Radiator };

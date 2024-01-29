import * as THREE from "three";
import { Radiator as RadiatorModel } from "../model";
import { BaseMesh, Mesh, Observer, ColorManager } from "./../system";

class Radiator extends BaseMesh implements Mesh, Observer {
  constructor(readonly model: RadiatorModel) {
    super(model);

    model.addObserver(this);
  }

  trigger() {
    this.reRender();
  }

  update() {}

  render() {
    return this.mesh;
  }
}

export { Radiator };

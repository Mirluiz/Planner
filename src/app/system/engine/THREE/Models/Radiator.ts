import * as THREE from "three";
import { Radiator as RadiatorModel } from "../../../../model";
import { BaseMesh, Mesh } from "../Mesh";

class Radiator extends BaseMesh implements Mesh {
  model: RadiatorModel;

  constructor(props: { model: RadiatorModel }) {
    super();

    this.model = props.model;
  }

  update() {}

  render() {
    return this.mesh;
  }
}

export { Radiator };

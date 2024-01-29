import * as THREE from "three";
import { Fitting as FittingModel } from "../model";
import { Observer, BaseMesh, Mesh } from "./../system";

class Fitting extends BaseMesh implements Mesh, Observer {
  constructor(readonly model: FittingModel) {
    super(model);

    model.addObserver(this);
  }

  trigger() {
    this.reRender();
  }

  reRender() {
    if (!this.mesh) return;

    if (!this.mesh) return;

    const geometry = new THREE.CylinderGeometry(0.1, 0.1, 1, 32);

    // this.mesh.geometry.dispose(); // Dispose of the old geometry to free up memory
    // this.mesh.geometry = geometry;

    this.mesh.position.set(
      this.model.position.x,
      this.model.position.y,
      this.model.position.z
    );

    this.mesh.updateMatrix();
  }

  render() {
    this.destroy();

    const geometry = new THREE.CylinderGeometry(
      this.model.dimension.width,
      this.model.dimension.width,
      this.model.dimension.height,
      32
    );
    const material = new THREE.MeshBasicMaterial({ color: 0x00 });
    const mesh = new THREE.Mesh(geometry, material);

    mesh.position.set(
      this.model.position.x,
      this.model.position.y,
      this.model.position.z
    );

    mesh.userData.object = this;
    mesh.name = "Fitting";

    this.mesh = mesh;

    return this.mesh;
  }
}

export { Fitting };

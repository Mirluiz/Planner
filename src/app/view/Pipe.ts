import * as THREE from "three";
import { BaseMesh, Mesh, Observer, ColorManager } from "../../system";
import { Pipe as PipeModel } from "../model";
import { App } from "../App";

class Pipe extends BaseMesh implements Mesh, Observer {
  constructor(readonly model: PipeModel) {
    super(model);

    model.addObserver(this);
  }

  trigger() {
    this.reRender();
  }

  reRender() {
    this.destroy();

    if (!this.mesh) return;

    let ln = this.model.start.distanceTo(this.model.end);

    const geometry = new THREE.BoxGeometry(ln, 0.1, 0.1);
    const material = new THREE.MeshPhongMaterial({
      color: this.model.flow === "red" ? 0xff0000 : 0x0000ff,
    });

    if (this.mesh instanceof THREE.Mesh) this.mesh.geometry = geometry;

    const midPoint = new THREE.Vector3();
    midPoint.addVectors(this.model.start, this.model.end).multiplyScalar(0.5);

    this.mesh.position.set(midPoint.x, midPoint.y, midPoint.z);

    this.mesh.lookAt(this.model.end);
    this.mesh.rotateY(Math.PI / 2);

    this.mesh.updateMatrix();
  }

  render() {
    this.destroy();

    let ln = this.model.start.distanceTo(this.model.end);

    const geometry = new THREE.BoxGeometry(ln, 0.1, 0.1);
    const material = new THREE.MeshPhongMaterial({
      color: this.model.flow === "red" ? 0xff0000 : 0x0000ff,
    });

    const midPoint = new THREE.Vector3();
    midPoint.addVectors(this.model.start, this.model.end).multiplyScalar(0.5);

    const mesh = new THREE.Mesh(geometry, material);

    mesh.position.copy(midPoint);

    mesh.lookAt(this.model.end);
    mesh.rotateY(Math.PI / 2);

    mesh.name = "Pipe";

    mesh.userData.object = this;

    this.mesh = mesh;

    return this.mesh;
  }
}

export { Pipe };

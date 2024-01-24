import * as THREE from "three";
import { BaseMesh, Mesh } from "../Mesh";
import { Pipe as PipeModel } from "../../../../model";

class Pipe extends BaseMesh implements Mesh {
  constructor(private model: PipeModel) {
    super();
  }

  update() {
    if (!this.mesh) return;

    let ln = this.model.start.distanceTo(this.model.end);

    const geometry = new THREE.BoxGeometry(ln, 0.1, 0.1);
    const material = new THREE.MeshPhongMaterial({
      color: this.model.flow === "red" ? 0xff0000 : 0x0000ff,
    });

    this.mesh.geometry.dispose(); // Dispose of the old geometry to free up memory
    this.mesh.geometry = geometry;

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

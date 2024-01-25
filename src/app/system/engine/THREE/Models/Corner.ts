import * as THREE from "three";
import { Corner as CornerModel } from "../../../../model";
import { BaseMesh, Mesh } from "../Mesh";
import { Observer } from "../../../interfaces/Observer";

class Corner extends BaseMesh implements Mesh, Observer {
  constructor(private model: CornerModel) {
    super();

    model.addObserver(this);
  }

  update() {
    if (!this.mesh) return;

    const geometry = new THREE.CylinderGeometry(0.1, 0.1, 0.1, 32);
    const material = new THREE.MeshBasicMaterial({
      color: this.model.hovered ? 0x6e90ff : 0x000000,
    });
    //this.model.hovered ? 0x6e90ff

    let highestPoint = this.model.walls.sort(
      (a, b) => b.dimension.height - a.dimension.height
    )[0];

    if (this.mesh instanceof THREE.Mesh) {
      this.mesh.geometry.dispose(); // Dispose of the old geometry to free up memory
      this.mesh.geometry = geometry;
      this.mesh.material = material;
    }
    console.log("===", this.model.position.x);

    this.mesh.position.set(
      this.model.position.x,
      this.model.position.y + highestPoint.dimension.height + 0.1 / 2,
      this.model.position.z
    );

    this.mesh.updateMatrix();
  }

  render() {
    this.destroy();

    const geometry = new THREE.CylinderGeometry(0.1, 0.1, 0.1, 32);
    const material = new THREE.MeshBasicMaterial({
      color: 0x000000,
    });
    const mesh = new THREE.Mesh(geometry, material);

    let highestPoint = this.model.walls.sort(
      (a, b) => b.dimension.height - a.dimension.height
    )[0];

    mesh.position.set(
      this.model.position.x,
      this.model.position.y + highestPoint.dimension.height + 0.1 / 2,
      this.model.position.z
    );

    mesh.userData.object = this;
    mesh.name = "Corner";

    this.mesh = mesh;

    return this.mesh;
  }
}

export { Corner };

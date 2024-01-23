import * as THREE from "three";
import { Storage } from "./../../";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";
import { Vector3 } from "three";
import { BaseMesh, Mesh } from "./Mesh";
import { Corner as CornerModel } from "../../../model";

class Corner extends BaseMesh implements Mesh {
  model: CornerModel;

  constructor(props: { model: CornerModel }) {
    super();

    this.model = props.model;
  }

  update() {
    if (!this.mesh) return;

    const geometry = new THREE.CylinderGeometry(0.1, 0.1, 1, 32);

    this.mesh.geometry.dispose(); // Dispose of the old geometry to free up memory
    this.mesh.geometry = geometry;

    let textMesh = this.mesh.children[0];
    if (textMesh instanceof THREE.Mesh) {
      textMesh.geometry.dispose();
      textMesh.material.dispose();
      textMesh.removeFromParent();
    }

    let txtMesh = this.getText();
    if (txtMesh) {
      this.mesh.add(txtMesh);
    }

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

    let txtMesh = this.getText();
    if (txtMesh) {
      mesh.add(txtMesh);
    }

    this.mesh = mesh;

    return this.mesh;
  }

  private getText() {
    if (!Storage.debug) return null;

    let textMesh: null | THREE.Mesh = null;

    if (Storage.font) {
      const scale = 800;
      const textGeometry = new TextGeometry(this.model.uuid.slice(0, 3), {
        font: Storage.font,
        size: 120 / scale,
        height: 1 / scale,
        bevelThickness: 1 / scale,
      });

      const material = new THREE.MeshBasicMaterial({ color: 0x00 });
      textMesh = new THREE.Mesh(textGeometry, material);

      textMesh.rotateOnAxis(new Vector3(1, 0, 0), -Math.PI / 2);
      textMesh.position.copy(new Vector3(0.5, 2, 0));
    }

    return textMesh;
  }
}

export { Corner };

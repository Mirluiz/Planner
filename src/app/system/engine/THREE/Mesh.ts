import * as THREE from "three";
import { Engine } from "../../interfaces";

interface Mesh {
  render: () => THREE.Mesh<any, any> | null;
  update: () => void;
  destroy: () => void;
}

class BaseMesh implements Mesh {
  private _mesh: THREE.Mesh<any, any> | null = null;

  get mesh() {
    return this._mesh;
  }

  set mesh(m) {
    this._mesh = m;
  }

  destroy() {
    this.mesh?.children.map((child) => {
      if (child instanceof THREE.Mesh) {
        child.geometry.dispose();
        child.material.dispose();
        child.removeFromParent();
      }
    });

    this.mesh?.material?.dispose();
    this.mesh?.material?.map?.dispose();
    this.mesh?.geometry?.dispose();
    this.mesh?.removeFromParent();
    this.mesh?.remove();
  }

  render() {
    return this._mesh;
  }
  update() {}
}

export { Mesh, BaseMesh };

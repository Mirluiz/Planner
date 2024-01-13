import * as THREE from "three";

namespace Engine {
  export class Mesh {
    mesh: THREE.Mesh<any, any> | null = null;

    render(mesh: THREE.Mesh) {
      this.mesh = mesh;
    }

    destroy() {
      this.mesh?.children.map((child) => {
        if(child instanceof THREE.Mesh){
          child.geometry.dispose()
          child.material.dispose()
          child.removeFromParent();
        }
      })

      this.mesh?.material?.dispose();
      this.mesh?.material?.map?.dispose();
      this.mesh?.geometry?.dispose();
      this.mesh?.removeFromParent();
      this.mesh?.remove();
    }

    returnTHREE() {
      return this.mesh;
    }
  }
}

export { Engine };

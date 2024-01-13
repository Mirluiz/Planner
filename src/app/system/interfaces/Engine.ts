namespace Engine {
  export class Mesh {
    mesh: THREE.Mesh<any, any> | null = null;

    render(mesh: THREE.Mesh) {
      this.mesh = mesh;
    }

    destroy() {
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

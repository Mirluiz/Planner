type Camera = {
  mode: "2D" | "3D";
  pos: { x: number; y: number; z: number };
  target: { x: number; y: number; z: number };
  zoom: number;
};

class LocalStorage {
  _camera: Camera | null = null;

  get camera() {
    return this._camera;
  }

  set camera(c) {
    this._camera = c;
    this.updateLocalStorage();
  }

  constructor() {
    this.camera = this.getCamera();
    // this._token = window.localStorage.getItem("token");
  }

  updateLocalStorage() {
    window.localStorage.setItem("camera", JSON.stringify(this.camera));
  }

  private getCamera() {
    let stringData = window.localStorage.getItem("camera");
    let cameraData: Camera | null = stringData ? JSON.parse(stringData) : null;

    return cameraData;
  }
}

export { LocalStorage };

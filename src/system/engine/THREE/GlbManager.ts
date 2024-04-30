import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";

class GlbManager {
  static loader: GLTFLoader = new GLTFLoader();

  static init() {
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath("/examples/jsm/libs/draco/");
    this.loader.setDRACOLoader(dracoLoader);
  }
}

export { GlbManager };

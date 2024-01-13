import {Font, FontLoader} from "three/examples/jsm/loaders/FontLoader";

class Storage {
  static materials: { [key: string]: THREE.MeshBasicMaterial } = {};
  static font: Font | null = null;

  static init() {
    return new Promise((resolve, reject) => {
      const loader = new FontLoader();
      const fontName = "font";
      const fontWeight = "";
      loader.load(fontName + ".json", (response) => {
        this.font = response;
        resolve("");
      });
    });
  }
}

export { Storage };

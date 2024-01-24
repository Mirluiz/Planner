import * as THREE from "three";
import { Scene as SceneController } from "./../controller/Scene";
import { Scene as THREEScene } from "./../system/engine/THREE/Scene";
import { Scene as PIXIScene } from "./../system/engine/Pixi/Scene";

class Scene {
  engine: THREEScene;
  onRender: ((intersection: THREE.Intersection[]) => void) | null = null;

  constructor(props: { canvas: HTMLElement; controller: SceneController }) {
    this.engine = new THREEScene(props);
  }
}

export { Scene };

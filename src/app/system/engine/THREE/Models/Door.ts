import { Object3DProps, Storage } from "../../../";
import * as THREE from "three";
import { Wall as WallModel } from "../../../../model/Wall/Wall";
import { Mesh, BaseMesh } from "../Mesh";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";
import { Observer } from "../../../interfaces/Observer";
import { ColorManager } from "../../../utils/Color";
import { Scene } from "../../../../controller";
import { App } from "../../../../App";
import { Vector3 } from "three";

class Door extends BaseMesh implements Mesh, Observer {
  constructor(readonly model: WallModel, private app: App) {
    super(model);

    model.addObserver(this);
  }

  trigger() {
    this.reRender();
  }

  update(props: {
    position?: { x: number; y: number; z: number };
    meshIntersectionPosition?: { x: number; y: number; z: number };
  }) {
    console.log("==");
  }

  reRender() {
    if (!this.mesh) return;

    const midPoint = new THREE.Vector3(
      this.model.position.x,
      this.model.position.y,
      this.model.position.z
    );

    this.mesh.position.copy(midPoint);

    this.mesh.updateMatrix();
  }

  render() {
    this.destroy();

    const geometry = new THREE.PlaneGeometry(1, 1);
    const material = new THREE.MeshBasicMaterial({
      color: 0xffff00,
      side: THREE.DoubleSide,
    });

    const mesh = new THREE.Mesh(geometry, material);

    mesh.rotateX(Math.PI / 2);

    mesh.name = "Door";
    mesh.userData.object = this;

    this.mesh = mesh;

    return this.mesh;
  }
}

export { Door };

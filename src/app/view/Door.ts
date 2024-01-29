import * as THREE from "three";
import { Door as DoorModel } from "../model/Door";
import { BaseMesh, Mesh, Observer, ColorManager } from "./../system";
import { App } from "../App";
import { Wall } from "../model";

class Door extends BaseMesh implements Mesh, Observer {
  constructor(readonly model: DoorModel, private app: App) {
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
    console.log("=======");
    this.seekSnap();
  }

  seekSnap() {
    let { intersects } = this.app.sceneController.model;
    let firstObject = intersects[0]?.object?.model;
    console.log("===");

    if (firstObject instanceof Wall) {
      let angle = firstObject.end.clone().normalize();
      this.model.rotation.y = angle.y;
    }
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

    const geometry = new THREE.PlaneGeometry(1, 0.1);

    const edges = new THREE.EdgesGeometry(geometry);
    const mesh = new THREE.LineSegments(
      edges,
      new THREE.LineBasicMaterial({ color: 0x000fff })
    );

    mesh.rotateX(Math.PI / 2);

    const midPoint = new THREE.Vector3(
      this.model.position.x,
      this.model.position.y,
      this.model.position.z
    );

    mesh.position.copy(midPoint);

    mesh.name = "Door";
    mesh.userData.object = this;

    this.mesh = mesh;

    return this.mesh;
  }
}

export { Door };

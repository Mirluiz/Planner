import * as THREE from "three";
import { Corner as CornerModel } from "../model";
import { BaseMesh, Mesh, Observer, ColorManager } from "./../system";
import { App } from "../App";

class Corner extends BaseMesh implements Mesh, Observer {
  constructor(
    readonly model: CornerModel,
    private app: App,
  ) {
    super(model);

    model.addObserver(this);
  }

  trigger() {
    this.reRender2D();
  }

  update(props: { position?: { x: number; y: number; z: number } }) {
    const { position } = props;

    if (position) {
      this.model.position = { ...position };

      this.app.cornerController.update({}, this.model);
    }
  }

  onUpdate() {
    this.app.graphManager.update();
  }

  reRender2D() {
    if (!this.mesh) return;

    const material = new THREE.MeshBasicMaterial({
      color:
        this.hovered || this.temporary
          ? ColorManager.colors["lime"]
          : ColorManager.colors["beige"],
    });

    let highestPointUUID = this.model.walls.sort(
      (a, b) =>
        (this.app.sceneController.model.objectsBy[b]?.dimension?.height ?? 0) -
        (this.app.sceneController.model.objectsBy[a]?.dimension?.height ?? 0),
    )[0];

    let highestPoint =
      this.app.sceneController.model.objectsBy[highestPointUUID] ?? 0;

    if (this.mesh instanceof THREE.Mesh) {
      this.mesh.material.dispose();
      this.mesh.material = material;
    }

    this.mesh.position.set(
      this.model.position.x,
      this.model.position.y + (highestPoint?.dimension?.height ?? 1) + 0.1 / 2,
      this.model.position.z,
    );

    if (this.focused) {
      this.mesh.scale.set(2, 1, 2);
    } else {
      this.mesh.scale.set(1, 1, 1);
    }

    this.mesh.updateMatrix();
  }

  render2D() {
    this.destroy();

    const geometry = new THREE.CylinderGeometry(0.1, 0.1, 0.1, 32);
    const material = new THREE.MeshBasicMaterial({
      color: ColorManager.colors["beige"],
    });
    const mesh = new THREE.Mesh(geometry, material);

    let highestPointUUID = this.model.walls.sort(
      (a, b) =>
        (this.app.sceneController.model.objectsBy[b]?.dimension?.height ?? 0) -
        (this.app.sceneController.model.objectsBy[a]?.dimension?.height ?? 0),
    )[0];

    let highestPoint =
      this.app.sceneController.model.objectsBy[highestPointUUID] ?? 0;

    mesh.position.set(
      this.model.position.x,
      this.model.position.y + (highestPoint?.dimension?.height ?? 1) + 0.1 / 2,
      this.model.position.z,
    );

    mesh.userData.object = this;
    mesh.name = "Corner";

    this.mesh = mesh;

    return this.mesh;
  }
}

export { Corner };

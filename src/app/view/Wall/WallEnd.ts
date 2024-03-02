import * as THREE from "three";
import { Wall as WallModel } from "../../model";
import { WallEnd as WallEndModel } from "../../model/Wall/WallEnd";
import { BaseMesh, ColorManager, Mesh, Observer } from "../../system";
import { Vector3 } from "three";
import { App } from "../../App";

/**
 * here is problem.
 * in besst case you need to move model to undefined | model type, because not every view has model
 * just create view for wall end, add in it wallcontroller and update places you need.
 * TODO: move model to undefined | model. set drag function that prevent bouncing of body wall
 */
class WallEnd extends BaseMesh implements Mesh, Observer {
  end: WallEndModel | null = null;

  constructor(
    readonly model: WallModel,
    private app: App,
  ) {
    super(model);

    model.addObserver(this);
  }

  trigger() {
    this.reRender2D();
  }

  update(props: {
    position?: { x: number; y: number; z: number };
    meshIntersectionPosition?: { x: number; y: number; z: number };
  }) {
    const { position, meshIntersectionPosition } = props;

    if (position && meshIntersectionPosition) {
      let mousePos = new Vector3(position.x, position.y, position.z);
      // hoveredElement.set(mousePos.x, mousePos.y, mousePos.z);

      this.app.wallController.update({}, this.model);
    }
  }

  reRender2D() {
    if (!this.mesh) return;

    let textMesh = this.mesh.children[0];

    if (textMesh instanceof THREE.Mesh) {
      textMesh.geometry.dispose();
      textMesh.material.dispose();
      textMesh.removeFromParent();
    }

    if (this.mesh instanceof THREE.Mesh) {
      this.mesh.geometry.dispose();
      this.mesh.material.dispose();
      this.mesh.material = new THREE.MeshStandardMaterial({
        color:
          this.focused || this.hovered
            ? ColorManager.colors["cyan"]
            : ColorManager.colors["brown"],
      });
    }

    this.mesh.updateMatrix();
  }

  render2D() {
    this.destroy();

    const geometry = new THREE.CylinderGeometry(0.1, 0.1, 0.1, 32);
    const material = new THREE.MeshBasicMaterial({
      color: ColorManager.colors["blue"],
    });
    const mesh = new THREE.Mesh(geometry, material);

    mesh.position.set(this.model.end.x, this.model.end.y + 2, this.model.end.z);

    mesh.userData.object = this;
    mesh.name = "Wall End";
    mesh.scale.set(2, 1, 2);

    this.mesh = mesh;

    return this.mesh;
  }

  render3D() {
    return this.render2D();
  }

  reRender3D() {
    return this.reRender2D();
  }
}

export { WallEnd };

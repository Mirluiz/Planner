import * as THREE from "three";
import { BaseMesh, Mesh, Observer, ColorManager, Storage } from "./../system";
import { Room as RoomModel } from "../model/Room";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";
import { Vector3 } from "three";

class Room extends BaseMesh implements Mesh, Observer {
  constructor(readonly model: RoomModel) {
    super(model);

    model.addObserver(this);
  }

  trigger() {
    this.reRender2D();
  }

  reRender2D() {
    if (!this.mesh) return;

    let geometry = this.getGeometry();

    if (this.mesh instanceof THREE.Mesh) {
      this.mesh.geometry.dispose();
      this.mesh.geometry = new THREE.BufferGeometry().setFromPoints(geometry);
      this.mesh.geometry.needsUpdate = true;

      this.mesh.position.y = -1;

      this.mesh.material.dispose();
      this.mesh.material = new THREE.MeshBasicMaterial({
        color: this.focused ? ColorManager.colors["light_grey"] : 0x916e53,
      });
    }

    this.mesh.updateMatrix();
  }

  render2D() {
    this.destroy();

    let geometry = new THREE.BufferGeometry().setFromPoints(this.getGeometry());

    const material = new THREE.MeshBasicMaterial({
      color: ColorManager.colors["light_grey"],
    });
    const mesh = new THREE.Mesh(geometry, material);

    material.transparent = true;
    material.opacity = 0.2;

    mesh.name = "Room";
    mesh.userData.object = this;
    mesh.position.y = -1;

    this.mesh = mesh;

    return this.mesh;
  }

  private getGeometry() {
    let verNumbers: Vector3[] = [];

    this.model.triangulation.map((v) => {
      verNumbers.push(new Vector3(v.position.x, v.position.y, v.position.z));
    });

    return verNumbers;
  }

  private getText(info?: string) {
    if (!Storage.debug) return null;

    let textMesh: null | THREE.Mesh = null;

    if (Storage.font) {
      const scale = 800;
      const textGeometry = new TextGeometry(
        `${this.model.uuid.slice(0, 3)} / ${info}`,
        {
          font: Storage.font,
          size: 120 / scale,
          height: 1 / scale,
          bevelThickness: 1 / scale,
        },
      );

      let center = new THREE.Vector3();

      this.model.corners.map((corner) => {
        center.add(
          new THREE.Vector3(
            corner.position.x,
            corner.position.y,
            corner.position.z,
          ),
        );
      });
      center.setX(center.x / this.model.corners.length);
      center.setY(center.y / this.model.corners.length);
      center.setZ(center.z / this.model.corners.length);

      const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
      textMesh = new THREE.Mesh(textGeometry, material);

      textMesh.rotateOnAxis(new THREE.Vector3(1, 0, 0), -Math.PI / 2);
      textMesh.position.copy(new THREE.Vector3(0, 1, 0));
    }

    return textMesh;
  }
}

export { Room };

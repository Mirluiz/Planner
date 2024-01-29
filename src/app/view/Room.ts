import * as THREE from "three";
import { BaseMesh, Mesh, Observer, ColorManager, Storage } from "./../system";
import { Room as RoomModel } from "../model/Room";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";

class Room extends BaseMesh implements Mesh, Observer {
  constructor(readonly model: RoomModel) {
    super(model);

    model.addObserver(this);
  }

  trigger() {
    this.reRender();
  }

  reRender() {
    if (!this.mesh) return;

    const geometry = this.getGeometry();

    const material = new THREE.MeshBasicMaterial({
      color: this.model.hovered ? ColorManager.colors["light_grey"] : 0xffffff,
    });

    let textMesh = this.mesh.children[0];
    if (textMesh instanceof THREE.Mesh) {
      textMesh.geometry.dispose();
      textMesh.material.dispose();
      textMesh.removeFromParent();
    }

    // this.mesh.geometry.dispose();
    // this.mesh.geometry = geometry;
    // this.mesh.material = material;

    let txtMesh = this.getText();
    if (txtMesh) {
      this.mesh.add(txtMesh);
    }

    this.mesh.updateMatrix();
  }

  render() {
    this.destroy();

    let geometry = this.getGeometry();

    const material = new THREE.MeshBasicMaterial({
      color: this.model.hovered ? ColorManager.colors["light_grey"] : 0xffffff,
    });
    const mesh = new THREE.Mesh(geometry, material);

    material.transparent = true;
    material.opacity = 0.5;

    mesh.name = "Room";
    mesh.userData.object = this;

    this.mesh = mesh;

    return this.mesh;
  }

  private getGeometry() {
    let geometry = new THREE.BufferGeometry();

    let verNumbers: number[] = [];

    this.model.triangulation.map((v) => {
      verNumbers.push(v.position.x, v.position.y, v.position.z);
    });

    let vert = new Float32Array(verNumbers);

    geometry.setAttribute("position", new THREE.BufferAttribute(vert, 3));

    return geometry;
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
        }
      );

      let center = new THREE.Vector3();

      this.model.corners.map((corner) => {
        center.add(
          new THREE.Vector3(
            corner.position.x,
            corner.position.y,
            corner.position.z
          )
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

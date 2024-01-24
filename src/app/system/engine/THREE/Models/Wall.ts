import { Storage } from "../../../";
import * as THREE from "three";
import { Wall as WallModel } from "../../../../model/Wall/Wall";
import { Mesh, BaseMesh } from "../Mesh";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";
import { Observer } from "../../../interfaces/Observer";

class Wall extends BaseMesh implements Mesh, Observer {
  constructor(private model: WallModel) {
    super();

    model.addObserver(this);
  }

  update() {
    if (!this.mesh) return;

    let geometry = this.getGeometry();

    if (!this.mesh) return;

    let textMesh = this.mesh.children[0];

    if (textMesh instanceof THREE.Mesh) {
      textMesh.geometry.dispose();
      textMesh.material.dispose();
      textMesh.removeFromParent();
    }

    this.mesh.geometry.dispose();
    this.mesh.geometry = geometry;
    this.mesh.material = new THREE.MeshStandardMaterial({ color: 0xefd0b5 });

    this.mesh.geometry.needsUpdate = true;

    const midPoint = new THREE.Vector3();
    midPoint.addVectors(this.model.start, this.model.end).multiplyScalar(0.5);

    this.mesh.position.copy(midPoint);

    this.mesh.lookAt(this.model.end);
    this.mesh.rotateY(Math.PI / 2);

    let txtMesh = this.getText();
    if (txtMesh) {
      this.mesh.add(txtMesh);
    }

    this.mesh.updateMatrix();
  }

  render() {
    this.destroy();

    let geometry = this.getGeometry();

    let ln = this.model.start.distanceTo(this.model.end);

    const material = new THREE.MeshStandardMaterial({ color: 0xefd0b5 });
    const mesh = new THREE.Mesh(geometry, material);

    const midPoint = new THREE.Vector3();
    midPoint.addVectors(this.model.start, this.model.end).multiplyScalar(0.5);

    mesh.position.copy(midPoint);

    mesh.lookAt(this.model.end);
    mesh.rotateY(Math.PI / 2);

    mesh.name = "Wall";
    mesh.userData.object = this;

    let textMesh = this.getText();

    if (textMesh) {
      mesh.add(textMesh);
    }

    this.mesh = mesh;

    return this.mesh;
  }

  private getGeometry() {
    let depth = 0.2;
    let ln = this.model.start.distanceTo(this.model.end);
    let h = 1.6;

    let endAngle = this.model.endAngle; // is angle
    let endCrop = (depth / 2) * Math.tan(endAngle);
    let endSideEdgeLn =
      Math.sqrt(endCrop * endCrop + (depth / 2) * (depth / 2)) * 2;

    let right = [
      new THREE.Vector3(0, h, endSideEdgeLn / 2)
        .applyAxisAngle(new THREE.Vector3(0, 1, 0), endAngle)
        .add(new THREE.Vector3(ln / 2, 0, 0)),
      new THREE.Vector3(0, h, -endSideEdgeLn / 2)
        .applyAxisAngle(new THREE.Vector3(0, 1, 0), endAngle)
        .add(new THREE.Vector3(ln / 2, 0, 0)),
      new THREE.Vector3(0, 0, endSideEdgeLn / 2)
        .applyAxisAngle(new THREE.Vector3(0, 1, 0), endAngle)
        .add(new THREE.Vector3(ln / 2, 0, 0)),
      new THREE.Vector3(0, 0, -endSideEdgeLn / 2)
        .applyAxisAngle(new THREE.Vector3(0, 1, 0), endAngle)
        .add(new THREE.Vector3(ln / 2, 0, 0)),
    ];

    let startAngle = this.model.startAngle; // is angle
    let startCrop = (depth / 2) * Math.tan(startAngle);

    let startSideEdgeLn =
      Math.sqrt(startCrop * startCrop + (depth / 2) * (depth / 2)) * 2;

    let left = [
      new THREE.Vector3(0, h, -startSideEdgeLn / 2)
        .applyAxisAngle(new THREE.Vector3(0, 1, 0), startAngle)
        .add(new THREE.Vector3(-ln / 2, 0, 0)),
      new THREE.Vector3(0, h, startSideEdgeLn / 2)
        .applyAxisAngle(new THREE.Vector3(0, 1, 0), startAngle)
        .add(new THREE.Vector3(-ln / 2, 0, 0)),
      new THREE.Vector3(0, 0, -startSideEdgeLn / 2)
        .applyAxisAngle(new THREE.Vector3(0, 1, 0), startAngle)
        .add(new THREE.Vector3(-ln / 2, 0, 0)),
      new THREE.Vector3(0, 0, startSideEdgeLn / 2)
        .applyAxisAngle(new THREE.Vector3(0, 1, 0), startAngle)
        .add(new THREE.Vector3(-ln / 2, 0, 0)),
    ];

    let front = [
      new THREE.Vector3(0, h, depth / 2).add(
        new THREE.Vector3(-ln / 2 + startCrop, 0, 0)
      ),
      new THREE.Vector3(0, h, depth / 2).add(
        new THREE.Vector3(ln / 2 + endCrop, 0, 0)
      ),
      new THREE.Vector3(0, 0, depth / 2).add(
        new THREE.Vector3(-ln / 2 + startCrop, 0, 0)
      ),
      new THREE.Vector3(0, 0, depth / 2).add(
        new THREE.Vector3(ln / 2 + endCrop, 0, 0)
      ),
    ];

    let back = [
      new THREE.Vector3(0, h, -depth / 2).add(
        new THREE.Vector3(ln / 2 - endCrop, 0, 0)
      ),
      new THREE.Vector3(0, h, -depth / 2).add(
        new THREE.Vector3(-ln / 2 - startCrop, 0, 0)
      ),
      new THREE.Vector3(0, 0, -depth / 2).add(
        new THREE.Vector3(ln / 2 - endCrop, 0, 0)
      ),
      new THREE.Vector3(0, 0, -depth / 2).add(
        new THREE.Vector3(-ln / 2 - startCrop, 0, 0)
      ),
    ];

    let up = [
      new THREE.Vector3(0, h, depth / 2).add(
        new THREE.Vector3(ln / 2 + endCrop, 0, 0)
      ),
      new THREE.Vector3(0, h, depth / 2).add(
        new THREE.Vector3(-ln / 2 + startCrop, 0, 0)
      ),
      new THREE.Vector3(0, h, -depth / 2).add(
        new THREE.Vector3(ln / 2 - endCrop, 0, 0)
      ),
      new THREE.Vector3(0, h, -depth / 2).add(
        new THREE.Vector3(-ln / 2 - startCrop, 0, 0)
      ),
    ];

    let bottom = [
      new THREE.Vector3(0, 0, depth / 2).add(
        new THREE.Vector3(-ln / 2 + startCrop, 0, 0)
      ),
      new THREE.Vector3(0, 0, depth / 2).add(
        new THREE.Vector3(ln / 2 + endCrop, 0, 0)
      ),
      new THREE.Vector3(0, 0, -depth / 2).add(
        new THREE.Vector3(-ln / 2 - startCrop, 0, 0)
      ),

      new THREE.Vector3(0, 0, -depth / 2).add(
        new THREE.Vector3(ln / 2 - endCrop, 0, 0)
      ),
    ];

    const vertices = [...front, ...up, ...right, ...bottom, ...back, ...left];

    return new THREE.BoxGeometry().setFromPoints(vertices);
  }

  private angle(start: THREE.Vector3, end: THREE.Vector3) {
    const dx = end.x - start.x;
    const dy = end.z - start.z;

    let theta = Math.atan2(dy, dx);
    theta *= 180 / Math.PI;

    return theta;
  }

  private getText() {
    if (!Storage.debug) return null;

    let textMesh: null | THREE.Mesh = null;

    if (Storage.font) {
      let polarAngle = this.angle(this.model.start, this.model.end);

      const scale = 800;
      const textGeometry = new TextGeometry(this.model.uuid.slice(0, 3), {
        font: Storage.font,
        size: 120 / scale,
        height: 1 / scale,
        bevelThickness: 1 / scale,
      });

      const material = new THREE.MeshBasicMaterial({ color: 0x00 });
      textMesh = new THREE.Mesh(textGeometry, material);

      if (Math.abs(polarAngle) < 90) {
        textMesh.rotateOnAxis(new THREE.Vector3(0, 1, 0), -Math.PI);
      }

      textMesh.rotateOnAxis(new THREE.Vector3(1, 0, 0), -Math.PI / 2);
      textMesh.position.copy(new THREE.Vector3(0, 1.7, 0));
    }

    return textMesh;
  }
}

export { Wall };

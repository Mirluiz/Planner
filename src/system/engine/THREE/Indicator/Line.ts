import { Observer } from "../../../../app/Interfaces/Observer";
import * as THREE from "three";
import { BaseMesh, Mesh } from "../Mesh";
import { Storage } from "../../../service";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";
import { Vector3 } from "three";
import { Pipe } from "../../../../app/model";

class Line extends BaseMesh implements Mesh, Observer {
  start: Vector3;
  end: Vector3;

  constructor(readonly model: Pipe, props: { start: Vector3; end: Vector3 }) {
    super(model);

    this.start = props.start;
    this.end = props.end;
  }

  trigger() {
    this.reRender();
  }

  reRender() {
    this.destroy();

    return this.mesh;
  }

  render() {
    const group = new THREE.Group();

    const material = new THREE.LineBasicMaterial({ color: 0x000000 });
    const ln = this.start.distanceTo(this.end);

    let size = 0.05;
    // prettier-ignore
    let vertices = new Float32Array([
      -size, -size, 0, // vertex 1
      size, -size, 0, // vertex 2
      0, size, 0, // vertex 3
    ]);

    {
      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3));
      const leftTriangle = new THREE.Mesh(geometry, material);
      leftTriangle.rotateX(-Math.PI / 2);
      leftTriangle.rotateZ(Math.PI / 2);
      leftTriangle.position.set(-ln / 2, 0, 0);

      group.add(leftTriangle);
    }
    {
      const geometry = new THREE.PlaneGeometry(ln / 2, 0.02);
      const arrowToLeft = new THREE.Mesh(geometry, material);
      arrowToLeft.rotateX(-Math.PI / 2);
      arrowToLeft.position.set(-ln / 4, 0, 0);

      group.add(arrowToLeft);
    }

    {
      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3));
      const rightTriangle = new THREE.Mesh(geometry, material);
      rightTriangle.rotateX(-Math.PI / 2);
      rightTriangle.rotateZ(-Math.PI / 2);
      rightTriangle.position.set(ln / 2, 0, 0);

      group.add(rightTriangle);
    }
    {
      const geometry = new THREE.PlaneGeometry(ln / 2, 0.02);
      const arrowToRight = new THREE.Mesh(geometry, material);
      arrowToRight.rotateX(-Math.PI / 2);
      arrowToRight.position.set(ln / 4, 0, 0);

      group.add(arrowToRight);
    }

    {
      const geometry = new THREE.PlaneGeometry(0.5, 0.3);
      const material = new THREE.MeshBasicMaterial({
        color: 0xfbffd5,
        side: THREE.DoubleSide,
      });
      const plane = new THREE.Mesh(geometry, material);
      const text = this.getText();
      plane.rotateX(Math.PI / 2);
      if (text) plane.add(text);

      group.add(plane);
    }

    const midPoint = new THREE.Vector3();
    midPoint.addVectors(this.start, this.end).multiplyScalar(0.5);

    group.position.copy(midPoint);

    group.lookAt(this.end);
    group.rotateY(Math.PI / 2);

    return group;
  }

  private getText() {
    let textMesh: null | THREE.Mesh = null;
    let ln = this.start.distanceTo(this.end);

    if (Storage.font) {
      let polarAngle = this.polarAngle();

      const scale = 1300;
      const textGeometry = new TextGeometry(`${ln.toString().slice(0, 3)} m`, {
        font: Storage.font,
        size: 120 / scale,
        height: 1 / scale,
        bevelThickness: 1 / scale,
      });

      const material = new THREE.MeshBasicMaterial({ color: 0x00 });
      textMesh = new THREE.Mesh(textGeometry, material);
      textMesh.rotateOnAxis(new THREE.Vector3(0, 0, 1), Math.PI);
      textMesh.rotateOnAxis(new THREE.Vector3(0, 1, 0), Math.PI);

      if (Math.abs(polarAngle) < 90) {
        textMesh.rotateOnAxis(new THREE.Vector3(0, 0, 1), Math.PI);
      }

      const boundingBox = new THREE.Box3();
      boundingBox.setFromObject(new THREE.Mesh(textGeometry));

      const size = new THREE.Vector3();
      boundingBox.getSize(size);

      if (Math.abs(polarAngle) < 90) {
        textMesh.position.copy(
          new THREE.Vector3(size.x / 2, -size.y / 2, size.z / 2)
        );
      } else {
        textMesh.position.copy(
          new THREE.Vector3(-size.x / 2, size.y / 2, -size.z / 2)
        );
      }
    }

    return textMesh;
  }

  private polarAngle() {
    const dx = this.end.x - this.start.x;
    const dy = this.end.z - this.start.z;

    let theta = Math.atan2(dy, dx);
    theta *= 180 / Math.PI;

    return theta;
  }
}

export { Line };

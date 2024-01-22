import {
  Entity,
  Object3D,
  Object3DProps,
  Object3DSchema,
  Engine,
  Helpers,
  Storage,
  Math2D,
} from "../system";
import * as THREE from "three";
import { Corner } from "./Wall/Corner";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";
import { Vector3, ShapeUtils } from "three";
import { Polygon } from "../system/utils/Polygon";
import { Color, ColorManager } from "../system/utils/Color";
import { Vertex } from "../controller";

class Room implements Object3D {
  hovered: boolean = false;
  mesh: Engine.Mesh | null = null;

  corners: Array<Corner> = [];
  triangulation: Array<Vertex> = [];

  uuid;
  dimension;
  rotation;
  position;

  constructor(props: Object3DProps) {
    this.uuid = props.uuid ?? Helpers.uuid();
    this.dimension = props.dimension ?? { width: 0.1, depth: 1, height: 1 };
    this.rotation = props.rotation ?? { w: 0, x: 0, y: 0, z: 0 };
    this.position = props.position ?? { x: 0, y: 0, z: 0 };

    this.mesh = new Engine.Mesh();
  }

  update() {
    if (!this.mesh) return;
    const threeMesh = this.mesh.returnTHREE();

    const geometry = this.getGeometry();

    const material = new THREE.MeshBasicMaterial({
      color: this.hovered ? ColorManager.colors["light_grey"] : 0xffffff,
    });

    if (!threeMesh) return;

    let textMesh = threeMesh.children[0];
    if (textMesh instanceof THREE.Mesh) {
      textMesh.geometry.dispose();
      textMesh.material.dispose();
      textMesh.removeFromParent();
    }

    threeMesh.geometry.dispose();
    threeMesh.geometry = geometry;
    threeMesh.material = material;

    let txtMesh = this.getText();
    if (txtMesh) {
      threeMesh.add(txtMesh);
    }

    this.mesh?.render(threeMesh);

    threeMesh.updateMatrix();
  }

  destroy() {
    this.mesh?.destroy();
  }

  render() {
    this.mesh?.destroy();
    let geometry = this.getGeometry();

    const material = new THREE.MeshBasicMaterial({
      color: this.hovered ? ColorManager.colors["light_grey"] : 0xffffff,
    });
    const mesh = new THREE.Mesh(geometry, material);

    material.transparent = true;
    material.opacity = 0.5;

    mesh.name = "Room";
    mesh.userData.object = this;

    // let txtMesh = this.getText(this.getArea().toString());
    // if (txtMesh) {
    //   mesh.add(txtMesh);
    // }

    this.mesh?.render(mesh);

    return this.mesh;
  }

  private getGeometry() {
    let geometry = new THREE.BufferGeometry();

    let verNumbers: number[] = [];

    this.triangulation.map((v) => {
      verNumbers.push(v.position.x, v.position.y, v.position.z);
    });

    let vert = new Float32Array(verNumbers);

    geometry.setAttribute("position", new THREE.BufferAttribute(vert, 3));

    return geometry;
  }

  private getArea() {
    let innerHole = [];
    let outerPolygon = [];
    let area = 0;

    let _i = 0;
    const n = this.triangulation.length;
    while (_i < this.triangulation.length) {
      const v0 = this.triangulation[_i];
      const v1 = this.triangulation[(_i + 1) % n];
      const v2 = this.triangulation[(_i + 2) % n];

      area +=
        Math.abs(
          v0.position.x * (v1.position.y - v2.position.y) +
            v1.position.x * (v2.position.y - v0.position.y) +
            v2.position.x * (v0.position.y - v1.position.y)
        ) / 2;

      _i += 3;
    }

    return area;
  }

  private getText(info?: string) {
    if (!Storage.debug) return null;

    let textMesh: null | THREE.Mesh = null;

    if (Storage.font) {
      const scale = 800;
      const textGeometry = new TextGeometry(
        `${this.uuid.slice(0, 3)} / ${info}`,
        {
          font: Storage.font,
          size: 120 / scale,
          height: 1 / scale,
          bevelThickness: 1 / scale,
        }
      );

      let center = new Vector3();

      this.corners.map((corner) => {
        center.add(
          new Vector3(corner.position.x, corner.position.y, corner.position.z)
        );
      });
      center.setX(center.x / this.corners.length);
      center.setY(center.y / this.corners.length);
      center.setZ(center.z / this.corners.length);

      const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
      textMesh = new THREE.Mesh(textGeometry, material);

      textMesh.rotateOnAxis(new Vector3(1, 0, 0), -Math.PI / 2);
      textMesh.position.copy(new Vector3(0, 1, 0));
    }

    return textMesh;
  }

  toJson() {
    return {
      uuid: this.uuid,
      dimension: this.dimension,
      rotation: this.rotation,
      position: this.position,
      type: Entity.FITTING,
    };
  }

  static fromJson(schema: Omit<Object3DSchema, "type">) {
    return new Room({ ...schema });
  }
}

export { Room };

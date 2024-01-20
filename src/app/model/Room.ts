import {
  Entity,
  Object3D,
  Object3DProps,
  Object3DSchema,
  Engine,
  Helpers,
  Storage,
  Math2D,
  Vertex,
} from "../system";
import * as THREE from "three";
import { Corner } from "./Wall/Corner";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";
import { Vector3, ShapeUtils } from "three";
import { Polygon } from "../system/utils/Polygon";

class Room implements Object3D {
  mesh: Engine.Mesh | null = null;

  corners: Array<Corner> = [];

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
      color: 0x009dc4,
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
      color: 0x009dc4,
    });
    const mesh = new THREE.Mesh(geometry, material);

    material.transparent = true;
    material.opacity = 0.5;

    let txtMesh = this.getText(this.getArea().toString());
    if (txtMesh) {
      mesh.add(txtMesh);
    }

    this.mesh?.render(mesh);

    return this.mesh;
  }

  private getGeometry() {
    let vertices: Vector3[] = [];
    let geometry = new THREE.BufferGeometry();

    // let res = Math2D.Polygon.earClipping([...this.corners].reverse());
    let res = Polygon.getTriangles([...this.corners]);
    console.log("res", res);

    // if (res) {
    //   vertices = res;
    // }
    //
    // let verNumbers: number[] = [];
    //
    // vertices.map((v) => {
    //   verNumbers.push(v.x, v.y, v.z);
    // });
    //
    // let vert = new Float32Array(verNumbers);
    //
    // geometry.setAttribute("position", new THREE.BufferAttribute(vert, 3));

    return geometry;
  }

  private getArea() {
    let vertices: Vector3[] = [];

    let triangulation = Polygon.getTriangles([...this.corners]);
    let innerHole = [];
    let outerPolygon = [];
    let area = 0;

    if (triangulation) {
      // vertices = triangulation;
    }

    let _i = 0;
    const n = vertices.length;
    while (_i < vertices.length) {
      const v0 = vertices[_i];
      const v1 = vertices[(_i + 1) % n];
      const v2 = vertices[(_i + 2) % n];

      area +=
        Math.abs(
          v0.x * (v1.z - v2.z) + v1.x * (v2.z - v0.z) + v2.x * (v0.z - v1.z)
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

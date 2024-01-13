import {
  Object3D,
  Object3DProps,
  Object3DSchema,
  Engine,
  Helpers,
  Geometry,
  Entity,
} from "../../system";
import * as THREE from "three";
import { PipeEnd } from "./PipeEnd";
import { Vector3 } from "three";

class Pipe implements Object3D, Geometry.Line {
  isPipe = true;

  mesh: Engine.Mesh | null = null;
  flow: "red" | "blue";

  uuid;
  dimension;
  rotation;
  position;

  start: PipeEnd;
  end: PipeEnd;

  constructor(
    props: {
      start: Vector3;
      end: Vector3;
      flow: "red" | "blue";
    } & Object3DProps
  ) {
    this.start = new PipeEnd(props.start.x, props.start.y, props.start.z);
    this.end = new PipeEnd(props.end.x, props.end.y, props.end.z);

    this.uuid = props.uuid ?? Helpers.uuid();
    this.dimension = { width: 1, height: 1, depth: 1 };
    this.rotation = props.rotation ?? { w: 0, x: 0, y: 0, z: 0 };
    this.position = props.position ?? { x: 0, y: 0, z: 0 };

    this.flow = props?.flow ?? "blue";

    this.mesh = new Engine.Mesh();
  }

  destroy() {
    this.mesh?.destroy();
  }

  update() {
    if (!this.mesh) return;
    const threeMesh = this.mesh.returnTHREE();

    let ln = this.start.distanceTo(this.end);

    const geometry = new THREE.BoxGeometry(ln, 0.1, 0.1);
    const material = new THREE.MeshPhongMaterial({
      color: this.flow === "red" ? 0xff0000 : 0x0000ff,
    });

    if (!threeMesh) return;

    threeMesh.geometry.dispose(); // Dispose of the old geometry to free up memory
    threeMesh.geometry = geometry;

    const midPoint = new THREE.Vector3();
    midPoint.addVectors(this.start, this.end).multiplyScalar(0.5);

    threeMesh.position.set(midPoint.x, midPoint.y, midPoint.z);

    threeMesh.lookAt(this.end);
    threeMesh.rotateY(Math.PI / 2);

    threeMesh.updateMatrix();
  }

  render() {
    this.mesh?.destroy();

    let ln = this.start.distanceTo(this.end);

    const geometry = new THREE.BoxGeometry(ln, 0.1, 0.1);
    const material = new THREE.MeshPhongMaterial({
      color: this.flow === "red" ? 0xff0000 : 0x0000ff,
    });

    const midPoint = new THREE.Vector3();
    midPoint.addVectors(this.start, this.end).multiplyScalar(0.5);

    const mesh = new THREE.Mesh(geometry, material);

    mesh.position.copy(midPoint);

    mesh.lookAt(this.end);
    mesh.rotateY(Math.PI / 2);

    mesh.name = "Pipe";

    mesh.userData.object = this;

    this.mesh?.render(mesh);

    return this.mesh;
  }

  static fromJson(schema: Object3DSchema) {
    if (!schema.start || !schema.end || !schema.flow) return;

    const pipe = new Pipe({
      start: new Vector3(schema.start.x, schema.start.y, schema.start.z),
      end: new Vector3(schema.end.x, schema.end.y, schema.end.z),
      flow: schema.flow,
    });

    pipe.position = schema.position;
    pipe.rotation = schema.rotation;
    pipe.uuid = schema.uuid;
    pipe.dimension = schema.dimension;

    return pipe;
  }

  toJson() {
    return {
      uuid: this.uuid,
      dimension: this.dimension,
      rotation: this.rotation,
      position: this.position,

      start: { ...this.start },
      end: { ...this.end },
      type: Entity.PIPE,
      flow: this.flow,
    };
  }
}

export { Pipe };

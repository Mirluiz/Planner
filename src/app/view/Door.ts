import * as THREE from "three";
import { Door as DoorModel } from "../model/Door";
import { BaseMesh, Mesh, Observer, Helpers, Math2D } from "./../system";
import { App } from "../App";
import { Wall as WallModel, Wall } from "../model";
import { Vector3 } from "three";
import { SUBTRACTION, Brush, Evaluator } from "three-bvh-csg";

class Door extends BaseMesh implements Mesh, Observer {
  uuid: string;
  constructor(readonly model: DoorModel, private app: App) {
    super(model);
    this.uuid = Helpers.uuid();
    model?.addObserver(this);
  }

  trigger() {
    this.reRender();
  }

  // update(props: {
  //   position?: { x: number; y: number; z: number };
  //   meshIntersectionPosition?: { x: number; y: number; z: number };
  // }) {
  //   if (props.position) this.model.position = { ...props.position };
  //
  //   if (props.position) this.seekSnap(props.position);
  // }

  reRender() {
    if (!this.mesh) return;

    const midPoint = new THREE.Vector3(
      this.model.position.x,
      this.model.position.y,
      this.model.position.z
    );

    this.mesh.position.copy(midPoint);
    this.mesh.rotation.y = this.model.rotation.y;

    this.mesh.updateMatrixWorld();
    this.mesh.updateMatrix();
  }

  render() {
    this.destroy();

    const geometry = new THREE.BoxGeometry(1, 2, 0.3);
    // const geometry = new THREE.PlaneGeometry(1, 2);

    const edges = new THREE.EdgesGeometry(geometry);

    const mesh = new THREE.LineSegments(
      edges,
      new THREE.LineBasicMaterial({ color: 0x000fff })
    );

    const midPoint = new THREE.Vector3(
      this.model.position.x,
      this.model.position.y,
      this.model.position.z
    );

    mesh.rotation.y = this.model.rotation.y;
    mesh.position.copy(midPoint);
    mesh.name = "Door";
    mesh.userData.object = {
      uuid: this.model.uuid,
      temporary: this.temporary,
    };

    this.mesh = mesh;

    return this.mesh;
  }

  private get walls() {
    return this.app.sceneController.model.objects.filter(
      (obj): obj is WallModel => {
        if (obj instanceof WallModel) {
          return Math2D.Line.isLine(obj);
        } else return false;
      }
    );
  }
}

export { Door };

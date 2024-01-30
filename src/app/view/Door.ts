import * as THREE from "three";
import { Door as DoorModel } from "../model/Door";
import {
  BaseMesh,
  Mesh,
  Observer,
  ColorManager,
  Helpers,
  Math2D,
} from "./../system";
import { App } from "../App";
import { Wall as WallModel, Wall } from "../model";
import { Vector3 } from "three";

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

  update(props: {
    position?: { x: number; y: number; z: number };
    meshIntersectionPosition?: { x: number; y: number; z: number };
  }) {
    if (props.position) this.model.position = { ...props.position };

    if (props.position) this.seekSnap(props.position);
  }

  seekSnap(position: { x: number; y: number; z: number }) {
    let snapsByDistance = Math2D.Line.seekSnap(
      this.walls,
      new Vector3(position.x, position.y, position.z)
    );

    let firstObject = snapsByDistance[0];

    if (firstObject && firstObject.distance < 2 && firstObject.object) {
      let angle = firstObject.object.end
        .clone()
        .sub(firstObject.object.start.clone())
        .normalize();
      this.model.rotation.y = Math.PI - Math.atan2(angle.z, angle.x);
      this.model.position = { ...firstObject.position };
    }
  }

  intersectionWithWall() {
    let { intersects } = this.app.sceneController.model;
    let firstObject = intersects[0]?.object?.model;

    if (firstObject instanceof Wall) {
      let angle = firstObject.end
        .clone()
        .sub(firstObject.start.clone())
        .normalize();
      this.model.rotation.y = Math.PI - Math.atan2(angle.z, angle.x);
    }
  }

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

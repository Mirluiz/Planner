import { Geometry } from "./../../system";
import { Engine } from "../interfaces/Engine";
import * as THREE from "three";
import { Scene as SceneView } from "../../scene/Scene";
import { Scene as SceneModel } from "../../model/Scene";
import { Pipe as PipeModel } from "../../model";
import { Math2D } from "./../utils";
import { App } from "../../App";
import { Vector3 } from "three";

class SnapHighlight {
  app: App;
  sceneView: SceneView | null;
  sceneModel: SceneModel;

  show: boolean = false;
  mesh: Engine.Mesh | null = null;
  start: Vector3;
  end: Vector3;

  constructor(props: { app: App }) {
    this.start = new Vector3(0, 0, 0);
    this.end = new Vector3(0, 0, 0);

    this.app = props.app;
    this.sceneView = props.app.sceneController.view;
    this.sceneModel = props.app.sceneController.model;

    this.mesh = new Engine.Mesh();

    let threeMesh = this.render()?.returnTHREE();
    if (threeMesh) this.sceneView?.scene.add(threeMesh);
  }

  destroy() {
    this.mesh?.destroy();
  }

  run() {
    let pipes = this.sceneModel.objects.filter(
      (obj) => obj instanceof PipeModel
    );

    // if (!this.sceneView.app.pipeController.active) {
    //   this.show = false;
    //   return false;
    // }

    let snapsByDistance: Array<{ distance: number; position: Vector3 }> = [];

    // pipes.map((pipe) => {
    //   // if (!this.sceneView.app.pipeController.active) return;
    //
    //   if (pipe.uuid === this.app.pipeController.active?.uuid) return;
    //   if (pipe instanceof PipeModel) {
    //     let projection = Math2D.Line.vectorLineIntersectionPosition(
    //       new Vector3(
    //         this.sceneView.groundInters.x,
    //         this.sceneView.groundInters.y,
    //         this.sceneView.groundInters.z
    //       ),
    //       {
    //         start: pipe.start,
    //         end: pipe.end,
    //       }
    //     );
    //
    //     if (projection) snapsByDistance.push(projection);
    //   }
    // });

    snapsByDistance.sort((a, b) => {
      if (a.distance < b.distance) return -1;
      return 0;
    });

    const closestPipe = snapsByDistance[0];

    if (closestPipe && closestPipe.distance < 1 && this.sceneView) {
      this.show = true;

      this.start.set(
        // this.sceneView.app.pipeController.active.end.pos.x,
        // this.sceneView.app.pipeController.active.end.pos.y,
        // this.sceneView.app.pipeController.active.end.pos.z
        this.sceneView.groundInters.x,
        this.sceneView.groundInters.y,
        this.sceneView.groundInters.z
      );
      this.end.set(
        closestPipe.position.x,
        closestPipe.position.y,
        closestPipe.position.z
      );
    } else {
      this.show = false;
    }

    this.update();
  }

  update() {
    if (!this.mesh) return;
    const threeMesh = this.mesh.returnTHREE();

    let ln = this.start.distanceTo(this.end);

    const geometry = new THREE.BoxGeometry(ln, 0.1, 0.1);

    if (!threeMesh) return;

    threeMesh.geometry.dispose();
    threeMesh.geometry = geometry;

    const midPoint = new THREE.Vector3();
    midPoint.addVectors(this.start, this.end).multiplyScalar(0.5);

    threeMesh.position.set(midPoint.x, midPoint.y, midPoint.z);
    threeMesh.visible = this.show;

    threeMesh.lookAt(this.end);
    threeMesh.rotateY(Math.PI / 2);

    threeMesh.updateMatrix();
  }

  render() {
    this.mesh?.destroy();

    let ln = this.start.distanceTo(this.end);

    const geometry = new THREE.BoxGeometry(ln, 0.1, 0.1);
    const material = new THREE.MeshPhongMaterial({
      color: 0x00,
    });

    material.opacity = 0.5;

    const midPoint = new THREE.Vector3();
    midPoint.addVectors(this.start, this.end).multiplyScalar(0.5);

    const mesh = new THREE.Mesh(geometry, material);

    mesh.position.copy(midPoint);
    mesh.visible = this.show;

    mesh.lookAt(this.end);
    mesh.rotateY(Math.PI / 2);

    mesh.name = "Snap highlight";

    this.mesh?.render(mesh);

    return this.mesh;
  }
}

export { SnapHighlight };

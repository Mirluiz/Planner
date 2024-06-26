import * as THREE from "three";
import { Door as DoorModel } from "../model";
import {
  BaseMesh,
  Mesh,
  Observer,
  Helpers,
  Math2D,
  ColorManager,
} from "../../system";
import { App } from "../App";
import { Wall as WallModel, Wall } from "../model";
import { Group, Vector3 } from "three";
import { GlbManager } from "../../system/engine/THREE/GlbManager";
import { GLTF } from "three/examples/jsm/loaders/GLTFLoader";

class Door extends BaseMesh implements Mesh, Observer {
  uuid: string;

  loadedGlb: Group | null = null;

  constructor(
    readonly model: DoorModel,
    private app: App,
  ) {
    super(model);
    this.uuid = Helpers.uuid();
    model?.addObserver(this);
  }

  trigger() {
    this.reRender2D();
  }

  update(props: {
    position?: { x: number; y: number; z: number };
    meshIntersectionPosition?: { x: number; y: number; z: number };
  }) {
    let { position, meshIntersectionPosition } = props;

    if (position && meshIntersectionPosition) {
      let meshIPVec = new Vector3(
        meshIntersectionPosition.x,
        meshIntersectionPosition.y,
        meshIntersectionPosition.z,
      );
      let mousePos = new Vector3(position.x, position.y, position.z);
      let newMidPosition = mousePos.clone().sub(meshIPVec);

      let difference = newMidPosition.sub(
        new Vector3(
          this.model.position.x,
          this.model.position.y,
          this.model.position.z,
        ),
      );

      let updatedPos = new Vector3(
        this.model.position.x,
        this.model.position.y,
        this.model.position.z,
      )
        .clone()
        .add(difference);
      // let endModelPos = this.model.end.clone().add(difference);

      this.app.wallElementController.update(
        {
          pos: updatedPos.clone(),
        },
        this.model,
      );
    }
  }

  reRender3D() {
    if (!this.mesh) return;

    const midPoint = new THREE.Vector3(
      this.model.position.x,
      this.model.dimension.height / 2,
      this.model.position.z,
    );

    this.mesh.position.copy(midPoint);
    this.mesh.rotation.y = this.model.rotation.y;

    this.mesh.updateMatrixWorld();
    this.mesh.updateMatrix();
  }

  render3D() {
    this.destroy();
    let group = new THREE.Group();

    // if (!this.loadedGlb) {
    //   GlbManager.loader.load(
    //     "/assets/glbs/wooden_door/scene.gltf",
    //     (gltf) => {
    //       group.add(gltf.scene);
    //       const box = new THREE.Box3().setFromObject(gltf.scene);
    //       const size = box.getSize(new THREE.Vector3());
    //
    //       gltf.scene.rotateY(Math.PI / 2);
    //       group.position.y = size.y / 2;
    //
    //       gltf.animations;
    //       gltf.scene;
    //       gltf.scenes;
    //       gltf.cameras;
    //       gltf.asset;
    //
    //       this.loadedGlb = gltf.scene.clone();
    //     },
    //     function (xhr) {
    //       console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
    //     },
    //     // called when loading has errors
    //     function (error) {
    //       console.log("An error happened", error);
    //     }
    //   );
    // }

    const midPoint = new THREE.Vector3(
      this.model.position.x,
      this.model.dimension.height / 2,
      this.model.position.z,
    );

    group.rotation.y = this.model.rotation.y;
    group.position.copy(midPoint);

    this.mesh = group;

    return this.mesh;
  }

  reRender2D() {
    if (!this.mesh) return;

    const midPoint = new THREE.Vector3(
      this.model.position.x,
      this.model.position.y,
      this.model.position.z,
    );

    this.mesh.position.copy(midPoint);
    let face = Math.atan2(this.model.face.z, this.model.face.x);
    this.mesh.rotation.y = Math.PI / 2 - face;

    this.mesh.updateMatrixWorld();
    this.mesh.updateMatrix();
  }

  render2D() {
    this.destroy();

    const mesh = this.drawSimpleDoor();

    const midPoint = new THREE.Vector3(
      this.model.position.x,
      this.model.position.y,
      this.model.position.z,
    );

    let face = Math.atan2(this.model.face.z, this.model.face.x);
    mesh.rotation.y = Math.PI / 2 - face;

    mesh.position.copy(midPoint);
    mesh.name = "Door";
    mesh.userData.object = {
      uuid: this.model.uuid,
      temporary: this.temporary,
    };
    mesh.userData.object = this;

    this.mesh = mesh;

    return this.mesh;
  }

  drawSimpleDoor() {
    let group = new THREE.Group();

    //line
    {
      const path = new THREE.Path();
      path.moveTo(-0.5, -1);
      path.quadraticCurveTo(0.5, -1, 0.5, 0);
      const points = path.getPoints();
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const material = new THREE.LineDashedMaterial({
        color: 0x00,
        linewidth: 2,
      });
      const line = new THREE.Line(geometry, material);
      line.rotateX(Math.PI / 2);

      group.add(line);
    }

    //door
    {
      const geometry = new THREE.PlaneGeometry(1.001, 0.06);
      const material = new THREE.MeshBasicMaterial({
        color: ColorManager.colors["light_grey"],
        side: 2,
      });
      const plane = new THREE.Mesh(geometry, material);

      plane.rotateX(Math.PI / 2);
      plane.rotateZ(Math.PI / 2);
      plane.position.add(new Vector3(-0.5, 0, -0.5));

      group.add(plane);
    }

    //door
    {
      const geometry = new THREE.PlaneGeometry(1.031, 0.15);
      const material = new THREE.MeshBasicMaterial({
        color: ColorManager.colors["grey"],
        side: 2,
      });
      const plane = new THREE.Mesh(geometry, material);

      plane.rotateX(Math.PI / 2);
      plane.position.add(new Vector3(-0.03 / 2, 0, 0));

      group.add(plane);
    }

    return group;
  }

  private get walls() {
    return this.app.sceneController.model.objects.filter(
      (obj): obj is WallModel => {
        if (obj instanceof WallModel) {
          return Math2D.Line.isLine(obj);
        } else return false;
      },
    );
  }
}

export { Door };

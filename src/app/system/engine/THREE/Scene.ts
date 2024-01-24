import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { LocalStorage, SnapHighlight, Math2D } from "../../../system";
import { Scene as SceneController } from "../../../controller/Scene";
import { Vector3 } from "three";
import { Relation } from "./Relation";

class Scene {
  controller: SceneController;

  camera: THREE.OrthographicCamera | THREE.PerspectiveCamera;
  scene: THREE.Scene;
  renderer: THREE.WebGLRenderer;
  axis: THREE.AxesHelper;
  controls: OrbitControls;
  intersected: boolean = false;
  pointer: THREE.Vector3;
  groundInters: { x: number; y: number; z: number } = { x: 0, y: 0, z: 0 };
  groundIntersNet: { x: number; y: number; z: number } = { x: 0, y: 0, z: 0 };
  raycaster: THREE.Raycaster;
  htmlElement: HTMLElement | null;
  cameraMode: "2D" | "3D";

  onRender: ((intersection: THREE.Intersection[]) => void) | null = null;

  localStorage: LocalStorage;

  snapHighLight: SnapHighlight | null = null;

  constructor(props: { canvas: HTMLElement; controller: SceneController }) {
    const { canvas, controller } = props;
    this.controller = controller;

    this.localStorage = new LocalStorage();

    this.renderer = new THREE.WebGLRenderer();

    this.renderer.setClearColor(0xffffff);

    this.axis = new THREE.AxesHelper(400);

    this.raycaster = new THREE.Raycaster();
    this.pointer = new THREE.Vector3();

    this.htmlElement = canvas;

    this.renderer.setSize(
      this.htmlElement.clientWidth,
      this.htmlElement.clientHeight
    );
    this.htmlElement.appendChild(this.renderer.domElement);

    this.camera = new THREE.OrthographicCamera(
      this.htmlElement.clientWidth / -2, // left
      this.htmlElement.clientWidth / 2, // right
      this.htmlElement.clientHeight / 2, // top
      this.htmlElement.clientHeight / -2, // bottom
      1,
      1000
    );

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);

    this.scene = new THREE.Scene();

    const axis = new THREE.AxesHelper(20);

    this.scene.add(axis);

    const netSize = 50;
    const helper = new THREE.GridHelper(netSize, netSize);
    this.scene.add(helper);

    const ambientLight = new THREE.AmbientLight(0xffffff, 1.3);
    this.scene.add(ambientLight);

    const hLight = new THREE.HemisphereLight(0xffffff, 0x000000, 0.5);
    hLight.position.set(1, 2, 0);
    this.scene.add(hLight);

    // this.cameraMode = this.localStorage.camera?.mode ?? "3D";
    this.cameraMode = "2D";

    this.initCamera();
    this.setCamera(this.cameraMode);

    this.renderer.domElement.setAttribute("tabindex", "0");
    this.renderer.domElement.focus();

    // this.snapHighLight = new SnapHighlight({ scene: this });
    this.subscribeEvents();
    this.initListeners();
  }

  private onPointerMove(event: MouseEvent) {
    if (!this.htmlElement) return;

    if (this.pointer) {
      this.pointer.x = (event.offsetX / this.htmlElement.clientWidth) * 2 - 1;
      this.pointer.y = -(event.offsetY / this.htmlElement.clientHeight) * 2 + 1;
    } else {
      this.pointer = new Vector3(
        (event.offsetX / this.htmlElement.clientWidth) * 2 - 1,
        -(event.offsetY / this.htmlElement.clientHeight) * 2 + 1
      );
    }
  }

  private initCamera() {
    if (this.localStorage && this.localStorage.camera) {
      this?.controls?.target.set(
        this.localStorage.camera.target.x,
        this.localStorage.camera.target.y,
        this.localStorage.camera.target.z
      );

      this.camera?.position.set(
        this.localStorage.camera.pos.x,
        this.localStorage.camera.pos.y,
        this.localStorage.camera.pos.z
      );

      this.camera.zoom = this.localStorage.camera.zoom;
      this.cameraMode = this.localStorage.camera.mode;
    }
  }

  private initListeners() {
    this.htmlElement?.addEventListener("mousemove", (event) => {
      this.onPointerMove(event);
    });

    this.htmlElement?.addEventListener("keydown", (event) => {
      if (event.code == "Escape") {
        this.controller.activeController?.reset();
        this.controller.activeController = null;
        this.controls.enabled = true;
        this.controller.event.emit("scene_update");
      }
    });
  }

  private subscribeEvents() {
    this.controller.event.subscribe("scene_update", () => {
      if (!this.scene) return;

      const runDelete = (
        children: Array<THREE.Mesh<any, any> | THREE.Group>
      ) => {
        for (let i = 0; i < children.length; i++) {
          let child = children[i];

          if (child.children) {
            // @ts-ignore
            runDelete(child.children);
          }

          if (child.userData.object) {
            if (child instanceof THREE.Mesh) {
              child?.material?.dispose();
              child?.material?.map?.dispose();
              child?.geometry?.dispose();
            }

            child?.removeFromParent();
            i--;
          }
        }
      };

      // @ts-ignore
      runDelete(this.scene.children);

      this.controller.model.objects.map((object) => {
        let renderModel = Relation(object);
        let mesh = renderModel?.render();
        if (mesh) this.scene.add(mesh);
      });
    });

    this.controller.event.subscribe("scene_update_element", (object) => {
      if (!this.scene) return;

      // object.update();
    });
  }

  setCamera(mode: "2D" | "3D") {
    if (!this.htmlElement) return;

    this.cameraMode = mode;
    let pos = { ...this.camera.position };
    let zoom = this.localStorage.camera?.zoom ?? 1;

    this.controls.reset();

    switch (this.cameraMode) {
      case "3D":
        this.camera = new THREE.PerspectiveCamera(
          30,
          this.htmlElement.clientWidth / this.htmlElement.clientHeight,
          0.1,
          100
        );

        this.camera.position.set(pos.x, 10, pos.z);

        if (this.controls) {
          this.controls.minPolarAngle = 0;
          this.controls.maxPolarAngle = Math.PI;
        }
        break;
      case "2D":
        let aspect =
          this.htmlElement.clientWidth / this.htmlElement.clientHeight;
        let frustumSize = 5;
        let far = 100;

        this.camera = new THREE.OrthographicCamera(
          (frustumSize * aspect) / -2,
          (frustumSize * aspect) / 2,
          frustumSize / 2,
          frustumSize / -2,
          0.1,
          far
        );

        this.camera.position.set(0, far / 2, 0);
    }

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.target.set(pos.x, 0, pos.z);
    this.controls.update();

    this.camera.position.setX(pos.x);
    this.camera.position.setZ(pos.z);

    this.camera.zoom = zoom;

    this.controls.minDistance = 0.1;
    this.controls.maxDistance = 100;

    if (this.cameraMode === "2D") {
      this.controls.enableRotate = false;
      this.controls.enableZoom = true;
      this.controls.enablePan = true;
    }

    this.camera.updateMatrix();
    this.controls.update();
  }

  animate() {
    requestAnimationFrame(this.animate.bind(this));

    this.raycaster.setFromCamera(
      new THREE.Vector2(this.pointer?.x, this.pointer?.y),
      this.camera
    );

    const planeIntersect = Math2D.NetAlgorithms.planeIntersection(
      new Vector3(0, 0, 0),
      this.raycaster.ray.clone()
    ).clone();

    this.groundInters = {
      x: planeIntersect.x,
      y: 0,
      z: planeIntersect.z,
    };

    this.groundIntersNet.x = +(this.groundInters.x / 10).toFixed(1) * 10;
    this.groundIntersNet.z = +(this.groundInters.z / 10).toFixed(1) * 10;

    this.snapHighLight?.run();

    this.renderer.render(this.scene, this.camera);

    let intersects = this.raycaster.intersectObjects(this.scene.children);

    if (this.onRender) this.onRender(intersects);
  }

  private updateCameraData() {
    this.localStorage.camera = {
      pos: {
        x: this.camera?.position?.x ?? 0,
        y: this.camera?.position?.y ?? 0,
        z: this.camera?.position?.z ?? 0,
      },
      target: {
        x: this.controls?.target.x ?? 0,
        y: this.controls?.target.y ?? 0,
        z: this.controls?.target.z ?? 0,
      },
      zoom: this.camera.zoom,
      mode: this.cameraMode,
    };
  }
}

export { Scene };

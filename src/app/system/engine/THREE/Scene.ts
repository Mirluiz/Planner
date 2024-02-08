import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { LocalStorage, SnapHighlight, Math2D } from "../../../system";
import { Scene as SceneController } from "../../../controller/Scene";
import { Vector3 } from "three";
import { Renderer } from "./Renderer";
import Stats from "three/examples/jsm/libs/stats.module";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment";

class Scene {
  controller: SceneController;

  stats: Stats;

  camera: THREE.OrthographicCamera | THREE.PerspectiveCamera;
  scene: THREE.Scene;
  renderer: THREE.WebGLRenderer;
  axis: THREE.AxesHelper;
  controls: OrbitControls;
  intersected: boolean = false;
  pointer: THREE.Vector3;

  netBinding: boolean = false;
  netStep: number = 10;

  ground: { x: number; y: number; z: number } = { x: 0, y: 0, z: 0 };
  groundInters: { x: number; y: number; z: number } = { x: 0, y: 0, z: 0 };
  mouseDownPosition: { x: number; y: number; z: number } = { x: 0, y: 0, z: 0 };

  raycaster: THREE.Raycaster;
  htmlElement: HTMLElement | null;
  cameraMode: "2D" | "3D";

  localStorage: LocalStorage;

  snapHighLight: SnapHighlight | null = null;
  intersects: THREE.Intersection[] = [];

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

    if (this.netBinding) {
      const netSize = 50;
      const helper = new THREE.GridHelper(netSize, netSize);
      this.scene.add(helper);
    }

    const ambientLight = new THREE.AmbientLight(0xffffff, 1.3);
    this.scene.add(ambientLight);

    const hLight = new THREE.HemisphereLight(0xffffbb, 0x080820, 1);
    hLight.position.set(1, 2, 0);
    // this.scene.add(hLight);

    this.cameraMode = this.localStorage.camera?.mode ?? "3D";
    // this.cameraMode = "2D";

    this.initCamera();
    this.setCamera(this.cameraMode);

    this.renderer.domElement.setAttribute("tabindex", "0");
    this.renderer.domElement.focus();

    this.renderer.outputEncoding = THREE.sRGBEncoding;

    const pmremGenerator = new THREE.PMREMGenerator(this.renderer);
    this.scene.environment = pmremGenerator.fromScene(
      new RoomEnvironment(),
      0.06
    ).texture;

    this.initEvents();
    this.subscribeEvents();

    this.stats = new Stats();
    document.body.appendChild(this.stats.dom);
  }

  onPointerMove(event: MouseEvent) {
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

  private initEvents() {
    this.controls.addEventListener("change", () => {
      this.updateCameraData();
    });

    this.htmlElement?.addEventListener("mousemove", () => {});

    this.htmlElement?.addEventListener("mousedown", () => {
      const planeIntersect = Math2D.NetAlgorithms.planeIntersection(
        new Vector3(0, 0, 0),
        this.raycaster.ray.clone()
      ).clone();

      this.ground = {
        x: planeIntersect.x,
        y: 0,
        z: planeIntersect.z,
      };

      this.mouseDownPosition.x = this.ground.x;
      this.mouseDownPosition.y = this.ground.y;
      this.mouseDownPosition.z = this.ground.z;
    });
  }

  private subscribeEvents() {
    this.controller.event.subscribe("scene_update", () => {
      if (!this.scene) return;

      const runDelete = (children: Array<THREE.Object3D>) => {
        for (let i = 0; i < children.length; i++) {
          let child = children[i];

          if (child.children) {
            // @ts-ignore
            runDelete(child.children);
          }

          if (child.userData.object) {
            if (child instanceof THREE.Mesh) {
              child?.geometry?.dispose();
              child?.material?.dispose();
              child?.material?.map?.dispose();
            }

            child?.removeFromParent();
            i--;
          }
        }
      };

      runDelete(this.scene.children);

      this.controller.model?.objects.map((object) => {
        let renderModel = Renderer.threeJS(object, this.controller.app);
        if (this.cameraMode === "2D") {
          let mesh = renderModel?.render2D();
          if (mesh) this.scene.add(mesh);
        } else {
          let mesh = renderModel?.render3D();
          if (mesh) this.scene.add(mesh);
        }
      });
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

    this.renderer.render(this.scene, this.camera);
    this.stats.update();

    const planeIntersect = Math2D.NetAlgorithms.planeIntersection(
      new Vector3(0, 0, 0),
      this.raycaster.ray.clone()
    ).clone();

    this.ground = {
      x: planeIntersect.x,
      y: 0,
      z: planeIntersect.z,
    };

    if (this.netBinding) {
      this.groundInters.x = +(this.ground.x / 10).toFixed(1) * 10;
      this.groundInters.z = +(this.ground.z / 10).toFixed(1) * 10;
    } else {
      this.groundInters.x = this.ground.x;
      this.groundInters.z = this.ground.z;
    }
    // console.log("this.raycaster.ray", this.raycaster.ray.origin);
    this.intersects = this.raycaster.intersectObjects(this.scene.children);

    this.snapHighLight?.run();
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

  updateGrid(nB: boolean) {
    this.netBinding = nB;

    if (this.netBinding) {
      const netSize = 50;
      const helper = new THREE.GridHelper(netSize, netSize);
      this.scene.add(helper);
    } else {
      this.scene.children.map((child) => {
        if (child instanceof THREE.GridHelper) {
          child.dispose();
          child.material.dispose();
          child.removeFromParent();
        }
      });
    }
  }
}

export { Scene };

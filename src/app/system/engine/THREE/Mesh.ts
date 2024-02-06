import * as THREE from "three";
import { Engine, Object3D, Object3DProps } from "../../interfaces";

interface Mesh {
  focused: boolean;
  hovered: boolean;

  model: Object3D;
  render: () => THREE.Object3D | null;
  reRender: () => void;
  create: (props: { position: { x: number; y: number; z: number } }) => void;
  update: (
    props: Partial<{
      position: { x: number; y: number; z: number };
      meshIntersectionPosition: { x: number; y: number; z: number };
    }>
  ) => void;
  onUpdate?: () => void;
  destroy: () => void;
}

class BaseMesh implements Mesh {
  focused = false;
  hovered = false;
  temporary = false;

  isBaseMesh = true;

  private _mesh: THREE.Object3D | null = null;

  constructor(readonly model: Object3D) {}

  get mesh() {
    return this._mesh;
  }

  set mesh(m) {
    this._mesh = m;
  }

  destroy() {
    this.mesh?.children.map((child) => {
      if (child instanceof THREE.Mesh || child instanceof THREE.LineSegments) {
        child.geometry.dispose();
        child.material.dispose();
        child.removeFromParent();
      }
    });

    if (
      this.mesh instanceof THREE.Mesh ||
      this.mesh instanceof THREE.LineSegments
    ) {
      this.mesh?.material?.dispose();
      this.mesh?.material?.map?.dispose();
      this.mesh?.geometry?.dispose();
      this.mesh?.removeFromParent();
    }

    this.mesh = null;
  }

  reRender() {}

  render() {
    return this.mesh;
  }
  update(props: Partial<Object3DProps>) {}
  create(props: Partial<Object3DProps>) {}
}

export { Mesh, BaseMesh };

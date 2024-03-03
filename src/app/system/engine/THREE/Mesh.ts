import * as THREE from 'three'
import { Engine, Object3D, Object3DProps } from '../../interfaces'
import { BufferGeometry } from 'three/src/core/BufferGeometry'
import { Material } from 'three/src/materials/Material'
import { MeshBasicMaterial } from 'three/src/materials/MeshBasicMaterial'
import { Helpers } from '../../utils'

interface Mesh {
  uuid: string
  focused: boolean
  hovered: boolean

  position: THREE.Vector3

  model: Object3D | null

  render2D: () => THREE.Object3D | null
  reRender2D: () => void
  render3D: () => THREE.Object3D | null
  reRender3D: () => void

  create: (props: { position: { x: number; y: number; z: number } }) => void
  update: (
    props: Partial<{
      position: { x: number; y: number; z: number }
      meshIntersectionPosition: { x: number; y: number; z: number }
    }>
  ) => void
  onUpdate?: () => void

  onHover: (pos: THREE.Vector3) => void
  onHoverEnd: () => void

  destroy: () => void
}

class BaseMesh implements Mesh {
  uuid: string

  focused = false
  hovered = false
  temporary = false

  isBaseMesh = true

  position: THREE.Vector3 = new THREE.Vector3()

  private _mesh: THREE.Object3D | null = null

  constructor(readonly model: Object3D | null) {
    this.uuid = Helpers.uuid()
  }

  get mesh() {
    return this._mesh
  }

  set mesh(m) {
    this._mesh = m
  }

  destroy() {
    const runDelete = (children: Array<THREE.Object3D>) => {
      for (let i = 0; i < children.length; i++) {
        let child = children[i]

        if (child.children) {
          runDelete(child.children)
        }

        if (child instanceof THREE.Mesh) {
          child?.geometry?.dispose()
          child?.material?.dispose()
          child?.material?.map?.dispose()
        }

        child?.removeFromParent()
        i--
      }
    }

    this.mesh?.children.map((child) => {
      if (child.children.length > 0) {
        runDelete(child.children)
      }

      if ('geometry' in child && child.geometry instanceof BufferGeometry) {
        child.geometry.dispose()
      }

      if ('material' in child && child.material instanceof Material) {
        child.material.dispose()
      }

      if ('material' in child && child.material instanceof MeshBasicMaterial) {
        child.material?.map?.dispose()
      }

      child.removeFromParent()
    })

    if (this.mesh && 'geometry' in this.mesh && this.mesh.geometry instanceof BufferGeometry) {
      this.mesh?.geometry?.dispose()
    }

    if (this.mesh && 'material' in this.mesh && this.mesh.material instanceof Material) {
      this.mesh?.material?.dispose()
    }

    if (this.mesh && 'material' in this.mesh && this.mesh.material instanceof MeshBasicMaterial) {
      this.mesh?.material?.map?.dispose()
    }

    this.mesh?.removeFromParent()

    this.mesh = null
  }

  reRender2D() {}

  render2D() {
    return this.mesh
  }

  reRender3D() {}

  render3D() {
    return this.mesh
  }

  update(props: Partial<Object3DProps>) {
    throw new Error('not implemented')
  }

  create(props: Partial<Object3DProps>) {
    throw new Error('not implemented')
  }

  onHover(pos: THREE.Vector3) {
    throw new Error('not implemented')
  }

  onHoverEnd() {
    throw new Error('not implemented')
  }
}

export { Mesh, BaseMesh }

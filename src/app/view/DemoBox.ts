import * as THREE from 'three'
import { BaseMesh, ColorManager, Mesh, Observer, Storage } from '../system'
import { App } from '../App'

class DemoBox extends BaseMesh implements Mesh, Observer {
  edgeResize: boolean = false
  dragMode: boolean = false

  leftTopEar: boolean = false
  rightTopEar: boolean = false
  leftBottomEar: boolean = false
  rightBottomEar: boolean = false

  constructor(private app: App) {
    super(null)

    this.dimension = { width: 1, height: 0.1, depth: 1 }
  }

  trigger() {
    this.reRender2D()
  }

  update(props: {
    position?: { x: number; y: number; z: number }
    meshIntersectionPosition?: { x: number; y: number; z: number }
  }) {
    let { position, meshIntersectionPosition } = props

    if (position && meshIntersectionPosition) {
      let meshIPVec = new THREE.Vector3(
        meshIntersectionPosition.x,
        meshIntersectionPosition.y,
        meshIntersectionPosition.z
      )
      let mousePos = new THREE.Vector3(position.x, position.y, position.z)
      let newMidPosition = mousePos.clone().sub(meshIPVec)

      this.position.copy(newMidPosition)
    }
  }

  reRender2D() {
    if (this.mesh instanceof THREE.Mesh) {
      this.mesh.geometry.dispose()
      this.mesh.geometry = new THREE.BoxGeometry(1, 0.1, 1)
      this.mesh.geometry.needsUpdate = true
      this.mesh.position.copy(this.position)
      this.mesh.material.dispose()
      this.mesh.material = new THREE.MeshBasicMaterial({
        color: this.hovered ? ColorManager.colors['light_grey'] : 0x916e53
      })
    }

    this.mesh?.updateMatrix()

    if (!this.mesh) return
  }

  render2D() {
    const geometry = new THREE.BoxGeometry(1, 0.1, 1)
    const material = new THREE.MeshBasicMaterial({ color: 0x916e53 })
    const cube = new THREE.Mesh(geometry, material)

    cube.position.copy(this.position)

    this.mesh = cube
    this.mesh.userData.object = this
    this.mesh.userData.system = true

    return this.mesh
  }

  render3D() {
    return this.render2D()
  }

  reRender3D() {
    return this.reRender2D()
  }

  drag(props: { position: THREE.Vector3 }): void {
    if (this.dragMode || this.edgeResize) {
      if (this.edgeResize) {
      } else {
        this.dragManager.update({
          net: Boolean(this.app.sceneController.view?.engine?.netBinding),
          position: props.position
        })
      }
    } else {
      if (this.isEdge(props.position)) {
        this.edgeResize = true
      } else {
        this.dragMode = true
        this.dragManager.update({
          net: Boolean(this.app.sceneController.view?.engine?.netBinding),
          position: props.position
        })
      }
    }
  }

  dragEnd() {
    this.dragManager.reset()
    this.edgeResize = false
    this.dragMode = false
  }

  onHover(pos: THREE.Vector3): void {
    this.hovered = true

    if (this.isEdge(pos) && !this.dragMode) {
      document.body.style.cursor = 'ew-resize'
    } else {
      document.body.style.cursor = 'default'
    }
  }

  onHoverEnd(): void {
    this.hovered = false
    document.body.style.cursor = 'default'
  }

  private isEdge(pos: THREE.Vector3): boolean {
    let ret = false
    let { depth, height, width } = this.dimension

    let rightTop = new THREE.Vector3(this.position.x + width / 2, 0, this.position.z + depth / 2),
      rightBottom = new THREE.Vector3(this.position.x + width / 2, 0, this.position.z - depth / 2),
      leftBottom = new THREE.Vector3(this.position.x - width / 2, 0, this.position.z - depth / 2),
      leftTop = new THREE.Vector3(this.position.x - width / 2, 0, this.position.z + depth / 2)

    if (pos) {
      ret = [rightBottom, leftBottom, leftTop, rightTop].some((vec) => {
        return Math.abs(vec.x - pos.x) < 0.1 || Math.abs(vec.z - pos.z) < 0.1
      })
    }

    return ret
  }

  private edgeDirection() {
    // return
  }
}

export { DemoBox }

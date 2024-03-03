import * as THREE from 'three'
import { BaseMesh, ColorManager, Mesh, Observer, Storage } from '../system'
import { App } from '../App'
import { log } from 'console'

class DemoBox extends BaseMesh implements Mesh, Observer {
  constructor(private app: App) {
    super(null)
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

  onHover(pos: THREE.Vector3): void {
    this.hovered = true
  }

  onHoverEnd(): void {
    this.hovered = false
  }
}

export { DemoBox }

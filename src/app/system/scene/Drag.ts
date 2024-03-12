import * as THREE from 'three'
import { Vector3 } from 'three'
import { Mesh } from '../engine/THREE/Mesh'

class Drag {
  element: {
    centerOffset: Vector3
    position: Vector3
    initialData: { position: Vector3 }
  } | null = null

  constructor(readonly mesh: Mesh) {}

  init(props: { position: Vector3 }) {
    this.element =
      {
        centerOffset: props.position
          .clone()
          .sub(new THREE.Vector3(this.mesh.position.x, this.mesh.position.y, this.mesh.position.z)),
        position: this.mesh.position.clone(),
        initialData: {
          position: props.position
        }
      } ?? null
  }

  update(props: { position: Vector3; net: boolean }) {
    if (!this.element) {
      this.init(props)
    }

    let { position } = props

    let mutablePos = new THREE.Vector3(position.x, position.y, position.z)
      .clone()
      .sub(this.element!.centerOffset)

    if (props.net && mutablePos) {
      mutablePos.x = +(mutablePos.x / 10).toFixed(1) * 10
      mutablePos.z = +(mutablePos.z / 10).toFixed(1) * 10
    }

    this.mesh.position.copy(mutablePos)
  }

  reset() {
    this.element = null
  }
}

export { Drag }

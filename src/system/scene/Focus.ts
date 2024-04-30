import { Vector3 } from 'three'
import { Mesh } from '../engine/THREE/Mesh'

class Focus {
  element: {
    centerOffset: Vector3
    position: Vector3
    object: Mesh
    initialData: { position: Vector3 }
  } | null = null

  update() {
    console.log('==')
  }
}

export { Focus }

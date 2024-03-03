import { Vector3 } from 'three'
import { Mesh } from '../engine/THREE/Mesh'
import { Scene } from '../engine'

class Drag {
  element: {
    centerOffset: Vector3
    position: Vector3
    object: Mesh
    initialData: { position: Vector3 }
  } | null = null

  constructor(readonly engine: Scene) {}

  start(props: {
    centerOffset: Vector3
    position: Vector3
    object: Mesh
    initialData: { position: Vector3 }
  }) {
    this.element = {
      centerOffset: props.centerOffset.clone(),
      object: props.object,
      position: props.position.clone(),
      initialData: {
        position: props.initialData.position.clone()
      }
    }
  }

  end() {
    this.element = null
  }

  update(props: { newPosition: { x: number; y: number; z: number } }) {
    let { newPosition } = props

    let mutablePos = new Vector3(newPosition.x, newPosition.y, newPosition.z)

    if (this.engine.netBinding && mutablePos) {
      mutablePos.x = +(mutablePos.x / 10).toFixed(1) * 10
      mutablePos.z = +(mutablePos.z / 10).toFixed(1) * 10
    }

    this.element?.object?.update({
      position: mutablePos,
      meshIntersectionPosition: this.element.centerOffset
    })

    this.element?.object?.reRender2D()
  }
}

export { Drag }

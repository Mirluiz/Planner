import * as THREE from 'three'
import { Scene as SceneController } from './../controller/Scene'
import { Scene as THREEScene } from './../system/engine/THREE/Scene'
import { App } from '../App'
import { Vector3 } from 'three'
import { BaseMesh, Mesh } from '../system/engine/THREE/Mesh'

class Scene {
  controller: App['sceneController']
  model: App['sceneController']['model']
  mode: 'draw' | null = null

  mouseDragged: boolean = false
  mousePressed: boolean = false

  engine: THREEScene | null = null

  focusedElement: {
    centerOffset: Vector3
    position: Vector3
    object: Mesh
    initialData: { position: Vector3 }
  } | null = null

  dragElement: {
    centerOffset: Vector3
    position: Vector3
    object: Mesh
    initialData: { position: Vector3 }
  } | null = null

  constructor(props: { canvas: HTMLElement; controller: SceneController }) {
    this.model = props.controller.model
    this.controller = props.controller
    this.engine = new THREEScene(props)

    this.initListeners()
  }

  private initListeners() {
    this.engine?.htmlElement?.addEventListener('mousedown', (event) => {
      if (!this.engine) return

      this.engine?.onPointerMove(event)
      if (event.button === 0) {
        this.mousePressed = true

        this.engine?.scene.children.map((child) => {
          if (this.isBaseMesh(child.userData?.object)) {
            let focused = child.userData.object.focused
            child.userData.object.focused = false

            if (focused) {
              child.userData.object.reRender2D()
            }
          }
        })

        this.updateFocusedObject()

        this.controller.model.event.emit('objects_updated')
      }
    })

    this.engine?.htmlElement?.addEventListener('mouseup', () => {
      if (!this.engine) return

      if (this.dragElement?.object) {
        this.dragElement.object.focused = false
        this.dragElement.object.model?.notifyObservers()
        this.dragElement = null
      }

      this.mousePressed = false
      this.mouseDragged = false
    })

    this.engine?.htmlElement?.addEventListener('mousemove', (event) => {
      if (!this.engine) return

      this.engine.onPointerMove(event)
      this.updateIntersection(this.engine.intersects)

      if (this.mousePressed) {
        this.mouseDragged = true
      }

      if (this.mousePressed && this.focusedElement) {
        this.updateDraggedObject()

        let diff = new Vector3(
          this.engine.mouseDownPosition.x - this.engine.groundInters.x,
          this.engine.mouseDownPosition.y - this.engine.groundInters.y,
          this.engine.mouseDownPosition.z - this.engine.groundInters.z
        )

        let updatedPosition = this.dragElement?.initialData.position.clone().sub(diff)

        if (this.engine.netBinding && updatedPosition) {
          updatedPosition.x = +(updatedPosition.x / 10).toFixed(1) * 10
          updatedPosition.z = +(updatedPosition.z / 10).toFixed(1) * 10
        }

        this.dragElement?.object?.update({
          position: updatedPosition,
          meshIntersectionPosition: this.dragElement.centerOffset
        })
        this.dragElement?.object.model?.notifyObservers()
      }
    })

    this.engine?.htmlElement?.addEventListener('keydown', (event) => {
      if (event.code == 'Escape') {
        console.log('esc pressed')
      }
    })

    this.engine?.htmlElement?.addEventListener('dblclick', () => {
      let intersection = this.model.intersects[0]

      if (intersection) {
        intersection.object.focused = true
        intersection.object.reRender2D()
        this.controller.model.event.emit('objects_updated')
      }
    })
  }



  private updateFocusedObject() {
    // this.focusedElement = null
    // let intersection = this.model.intersects[0]

    // let ground = new Vector3(
    //   this.engine?.groundInters.x,
    //   this.engine?.groundInters.y,
    //   this.engine?.groundInters.z
    // )

    // if (intersection?.object?.model) {
    //   this.focusedElement =
    //     {
    //       centerOffset: ground
    //         .clone()
    //         .sub(
    //           new Vector3(
    //             intersection.object.model.position.x,
    //             intersection.object.model.position.y,
    //             intersection.object.model.position.z
    //           )
    //         ),
    //       object: intersection.object,
    //       position: intersection.position.clone(),
    //       initialData: {
    //         position: ground
    //       }
    //     } ?? null
    // }
  }

  private updateDraggedObject() {
    if (this.focusedElement) {
      this.dragElement = {
        centerOffset: this.focusedElement.centerOffset.clone(),
        object: this.focusedElement.object,
        position: this.focusedElement.position.clone(),
        initialData: {
          position: this.focusedElement.initialData.position.clone()
        }
      }
    }
  }

 

 
}

export { Scene }

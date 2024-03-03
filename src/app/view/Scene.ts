import * as THREE from 'three'
import { Scene as SceneController } from './../controller/Scene'
import { Scene as THREEScene } from './../system/engine/THREE/Scene'
import { App } from '../App'
import { Vector3 } from 'three'
import { BaseMesh, Mesh } from '../system/engine/THREE/Mesh'
import { Drag, Intersection, Focus } from '../system'

class Scene {
  controller: App['sceneController']
  model: App['sceneController']['model']

  drag: Drag
  intersection: Intersection
  focus: Focus

  mouseDragged: boolean = false
  mousePressed: boolean = false

  engine: THREEScene | null = null

  constructor(props: { canvas: HTMLElement; controller: SceneController }) {
    this.model = props.controller.model
    this.controller = props.controller
    this.engine = new THREEScene(props)

    this.initListeners()

    this.drag = new Drag(this.engine)
    this.intersection = new Intersection(this.engine)
    this.focus = new Focus()
  }

  private initListeners() {
    this.engine?.htmlElement?.addEventListener('mousedown', (event) => {
      if (!this.engine) return

      this.engine?.onPointerMove(event)

      if (event.button === 0) {
        this.mousePressed = true

        this.focus.update()

        this.controller.model.event.emit('objects_updated')
      }
    })

    this.engine?.htmlElement?.addEventListener('mousemove', (event) => {
      if (!this.engine) return

      this.engine.onPointerMove(event)
      this.intersection.update(this.engine.intersects)

      if (this.mousePressed) {
        this.mouseDragged = true

        if (this.intersection.priorityObject && !this.drag.element) {
          let dragObject = this.intersection.getClickedObjectInfo()

          if (dragObject) {
            this.drag.start({
              centerOffset: dragObject.centerOffset,
              initialData: dragObject.initialData,
              object: dragObject.object,
              position: dragObject.position
            })
          }
        }
      }

      if (this.mousePressed) {
        this.drag.update({
          newPosition: this.engine.groundInters
        })
      }
    })

    this.engine?.htmlElement?.addEventListener('mouseup', () => {
      if (!this.engine) return

      this.mousePressed = false
      this.mouseDragged = false

      this.drag.end()
    })

    this.engine?.htmlElement?.addEventListener('keydown', (event) => {
      if (event.code == 'Escape') {
        console.log('esc pressed')
      }
    })

    this.engine?.htmlElement?.addEventListener('dblclick', () => {
      let { priorityObject } = this.intersection

      if (priorityObject) {
        priorityObject.object.focused = true
        priorityObject.object.reRender2D()
        this.controller.model.event.emit('objects_updated')
      }
    })
  }
}

export { Scene }

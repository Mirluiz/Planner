import { Vector3 } from 'three'
import { App } from '../app/App'
import { DemoBox as DemoBoxView } from '../app/view/DemoBox'

class DemoBox {
  readonly app: App

  constructor(props: { app: App }) {
    this.app = props.app
  }

  run() {
    let box = new DemoBoxView(this.app)
    let box1 = new DemoBoxView(this.app)
    let box2 = new DemoBoxView(this.app)

    box.position.copy(new Vector3(0, 0, 1))
    box1.position.copy(new Vector3(2, 0, 0))
    box2.position.copy(new Vector3(3, 0, 1))

    let mesh = box.render2D()
    let mesh1 = box1.render2D()
    let mesh2 = box2.render2D()

    if (mesh) this.app.sceneController.view?.engine?.scene.add(mesh)
    if (mesh1) this.app.sceneController.view?.engine?.scene.add(mesh1)
    if (mesh2) this.app.sceneController.view?.engine?.scene.add(mesh2)
  }
}

export { DemoBox }

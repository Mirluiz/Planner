import { Math2D } from '../../../system'
import { Controller } from '../Controller'
import { Door as DoorModel, Wall as WallModel, Wall, Door } from '../../model'
import { Door as DoorView } from '../../view/Door'
import { Vector3 } from 'three'
import { Base } from '../Base'

class WallElement extends Base implements Controller {
  model: DoorModel | null = null
  view: DoorView | null = null
  private ghostView: DoorView | null = null
  private ghostModel: DoorModel | null = null

  get walls() {
    return (
      this.sceneController.model?.objects.filter((obj): obj is WallModel => {
        if (obj instanceof WallModel) {
          return Math2D.Line.isLine(obj)
        } else return false
      }) ?? []
    )
  }

  create(pos: { x: number; y: number; z: number }) {
    let model = new DoorModel({
      position: new Vector3(pos.x, pos.y, pos.z),
      face: new Vector3()
    })

    let priorityObject = this.sceneController.view?.intersection.priorityObject

    if (priorityObject instanceof Wall) {
      let angle = priorityObject.end.clone().sub(priorityObject.start.clone()).normalize()
      if (model) model.rotation.y = Math.PI - Math.atan2(angle.z, angle.x)
    }

    if (model) {
      let { position } = model

      let snapsByDistance = Math2D.Line.seekSnap(
        this.walls,
        new Vector3(position.x, position.y, position.z)
      )

      let firstObject = snapsByDistance[0]

      if (
        firstObject &&
        firstObject.distance < 2 + firstObject.object.dimension.depth / 2 &&
        firstObject.object
      ) {
        let face = firstObject.position.clone().sub(new Vector3(pos?.x, pos?.y, pos?.z)).normalize()
        let angle = firstObject.object.end.clone().sub(firstObject.object.start.clone()).normalize()
        let wallDepthOffset = new Vector3(
          firstObject.position.x,
          firstObject.position.y,
          firstObject.position.z
        ).sub(
          new Vector3(face.x, face.y, face.z).multiplyScalar(firstObject.object.dimension.depth / 2)
        )
        model.rotation.y = Math.PI - Math.atan2(angle.z, angle.x)
        model.position = { ...wallDepthOffset }
        model.face = face

        let clockWise = angle.x * face.z - angle.z * face.x

        model.attachedWall = {
          wall: firstObject.object,
          centerOffset:
            firstObject.object.start.distanceTo(firstObject.position) /
            firstObject.object.start.clone().distanceTo(firstObject.object.end),
          faceClockwise: Math.sign(clockWise) > 0 ? 1 : -1
        }
      }
    }

    let view = new DoorView(model, this.app)

    if (view) {
      let render = view.render2D()
      if (render) this.sceneController.view?.engine?.scene.add(render)
    }

    this.sceneController.model.addObject(model)

    return model
  }

  update(
    props: Partial<{
      pos: Vector3
    }>,
    model: DoorModel
  ) {
    if (props.pos) model.position = { ...props.pos }

    let priorityObject = this.sceneController.view?.intersection.priorityObject

    if (priorityObject instanceof Wall) {
      let angle = priorityObject.end.clone().sub(priorityObject.start.clone()).normalize()

      if (model) model.rotation.y = Math.PI - Math.atan2(angle.z, angle.x)
    }

    model.face = new Vector3(0, 0, 1)

    if (model) {
      let { position } = model

      let snapsByDistance = Math2D.Line.seekSnap(
        this.walls,
        new Vector3(position.x, position.y, position.z)
      )

      let firstObject = snapsByDistance[0]

      if (
        firstObject &&
        firstObject.distance < 2 + firstObject.object.dimension.depth / 2 &&
        firstObject.object
      ) {
        let face = firstObject.position
          .clone()
          .sub(new Vector3(props?.pos?.x, props?.pos?.y, props?.pos?.z))
          .normalize()
        let angle = firstObject.object.end.clone().sub(firstObject.object.start.clone()).normalize()
        let wallDepthOffset = new Vector3(
          firstObject.position.x,
          firstObject.position.y,
          firstObject.position.z
        ).sub(
          new Vector3(face.x, face.y, face.z).multiplyScalar(firstObject.object.dimension.depth / 2)
        )

        model.rotation.y = Math.PI - Math.atan2(angle.z, angle.x)
        // model.position = { ...firstObject.position };
        model.position = { ...wallDepthOffset }
        model.face = face

        let clockWise = angle.x * face.z - angle.z * face.x

        model.attachedWall = {
          wall: firstObject.object,
          centerOffset:
            firstObject.object.start.distanceTo(firstObject.position) /
            firstObject.object.start.clone().distanceTo(firstObject.object.end),
          faceClockwise: Math.sign(clockWise) > 0 ? 1 : -1
        }
      }
    }

    model.notifyObservers()

    return model ?? null
  }

  reset() {
    this.sceneController.activeController = null

    this.model?.destroy()
    this.view?.destroy()

    this.model = null
    this.view = null

    this.ghostModel?.destroy()
    this.ghostView?.destroy()

    this.ghostModel = null
    this.ghostView = null
  }

  remove() {
    return this.model ?? null
  }

  createGhost() {
    let newDoor = Door.createDefault() 

    this.ghostView = new DoorView(newDoor, this.app)
    this.ghostModel = newDoor

    if (this.ghostView) {
      let render = this.ghostView.render2D()
      if (render) this.sceneController.view?.engine?.scene.add(render)
    }
  }

  mouseUp(pos: { x: number; y: number; z: number }) {}

  mouseDown(pos: { x: number; y: number; z: number }) {
    this.create(pos)
  }

  mouseMove(pos: { x: number; y: number; z: number }) {
    if (this.model instanceof DoorModel) {
      this.update({ pos: new Vector3(pos.x, pos.y, pos.z) }, this.model)
    }

    if (this.ghostModel) {
      this.update({ pos: new Vector3(pos.x, pos.y, pos.z) }, this.ghostModel)
    }
  }
}

export { WallElement }

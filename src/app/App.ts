import { Wall as WallController } from '../app/controller/Wall/Wall'
import { Room as RoomController } from '../app/controller/Room'
import { Object3D as Object3DController } from '../app/controller/Object3D'
import { Scene as SceneController } from './controller/Scene'
import { GraphManager } from './system/service/GraphManager'
import { Pipe as PipeController } from '../app/controller/Pipe'
import { EventSystem, Database, Object3D, Storage } from './system'
import { WallElement as WallElementController } from './controller'
import { Corner as CornerController } from './controller/Wall/Corner'

class App {
  database: Database = new Database()
  event: EventSystem = new EventSystem()
  graphManager: GraphManager

  wallController: WallController
  wallElementController: WallElementController
  pipeController: PipeController
  sceneController: SceneController
  roomController: RoomController
  cornerController: CornerController

  constructor(props: { canvas: HTMLElement | null }) {
    this.sceneController = new SceneController(props, this)

    this.graphManager = new GraphManager(this)
    this.pipeController = new PipeController(this, this.sceneController)
    this.roomController = new RoomController(this, this.sceneController)
    this.wallController = new WallController(this, this.sceneController)
    this.cornerController = new CornerController(this, this.sceneController)
    this.wallElementController = new WallElementController(this, this.sceneController)
  }

  init(): Promise<unknown> {
    return new Promise((resolve, reject) => {
      this.database.init(() => {
        this.database.get((res) => {
          Storage.init().then(() => {
            this.sceneController.model.objects
            this.event.emit('scene_update')
            resolve('')
          })
        })
      })
    })
  }

  run() {
    this.sceneController.view?.engine?.animate()
  }

  save() {
    let objects = this.sceneController.model.objects.map((object) => {
      return object.toJson()
    })

    this.database.set(
      {
        objects: objects
      },
      () => {
        console.log('saved')
      }
    )
  }

  reset() {
    this.database.clearObjects(() => {
      console.log('cleared')
    })
  }
}

export { App }

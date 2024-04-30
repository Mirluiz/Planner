import { describe, expect, test } from '@jest/globals'
import { Wall, WallEnd } from '../../app/model'
import { App } from '../../app/App'

describe('Door controller processes', () => {
  function createWall(
    startPos: { x: number; y: number; z: number },
    endPos: { x: number; y: number; z: number }
  ) {
    let start = new WallEnd({ x: startPos.x, y: startPos.y, z: startPos.z })
    let end = new WallEnd({ x: endPos.x, y: endPos.y, z: endPos.z })

    return new Wall({ start, end, position: { x: 0, y: 0, z: 0 } })
  }

  test('Put door on wall', () => {
    let app = new App({ canvas: null })
    let controller = app.wallController

    let wall = createWall({ x: 0, y: 0, z: 0 }, { x: 0, y: 0, z: 4 })

    app.sceneController.model.addObject(wall)

    controller.start({ x: 0.6, y: 0, z: 4.5 })

    expect(app.sceneController.model.objects.length).toBe(3)
  })

  test('Door snap on wall', () => {
    let app = new App({ canvas: null })
    let controller = app.wallController

    let wall = createWall({ x: 0, y: 0, z: 0 }, { x: 0, y: 0, z: 4 })

    app.sceneController.model.addObject(wall)

    controller.start({ x: 0.6, y: 0, z: 4.5 })

    expect(app.sceneController.model.objects.length).toBe(3)
  })
})

import { Corner, Wall as WallModel, WallEnd } from '../app/model'
import { App } from '../app/App'
import * as THREE from 'three'

class Wall {
  readonly app: App
  examples = [
    // {
    //   name: "One Wall",
    //   ends: [
    //     { x: 0, y: 0, z: -2 },
    //     { x: 0, y: 0, z: 3 },
    //   ],
    // },
    // {
    //   name: "One Wall",
    //   ends: [
    //     { x: 2, y: 0, z: 3 },
    //     { x: 2, y: 0, z: -2 },
    //   ],
    // },
    // {
    //   name: "One Wall",
    //   ends: [
    //     { x: 4, y: 0, z: -2 },
    //     { x: 8, y: 0, z: 2 },
    //   ],
    // },
    {
      name: 'One Wall',
      ends: [
        { x: -8, y: 0, z: -2 },
        { x: -2, y: 0, z: 2 }
      ]
    },
    {
      name: 'One Wall',
      ends: [
        { x: 0, y: 0, z: 2 },
        { x: -6, y: 0, z: -2 }
      ]
    }
  ]

  constructor(props: { app: App }) {
    this.app = props.app
  }

  run() {
    this.examples.map((cornerData, index) => {
      let wall = new WallModel({
        start: new WallEnd({
          x: cornerData.ends[0].x,
          y: cornerData.ends[0].y,
          z: cornerData.ends[0].z
        }),
        end: new WallEnd({
          x: cornerData.ends[1].x,
          y: cornerData.ends[1].y,
          z: cornerData.ends[1].z
        })
      })

      wall.updateCenter()

      this.app.sceneController.model.addObject(wall)
    })
  }
}

export { Wall }

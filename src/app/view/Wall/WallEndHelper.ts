import { Wall as WallModel } from '../../model'
import { App } from '../../App'
import { Vector3 } from 'three'

class WallEndHelper {
  constructor(readonly model: WallModel, private app: App) {}

  getEnd(pos: Vector3) {
    let { start, end } = this.model
    let wallEnd = start.distanceTo(pos) < end.distanceTo(pos) ? start : end
    return wallEnd
  }

  getEndString(pos: Vector3): 'start' | 'end' | null {
    let { start, end } = this.model
    let wallEnd: 'start' | 'end' | null =
      start.distanceTo(pos) < 1 ? 'start' : end.distanceTo(pos) < 1 ? 'end' : null
    return wallEnd
  }

  isEnd(pos: Vector3) {
    let { start, end } = this.model

    return start.distanceTo(pos) < 1 || end.distanceTo(pos) < 1
  }
}

export { WallEndHelper }

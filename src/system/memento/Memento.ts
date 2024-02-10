import {ContainerSchema} from '../../types/schemas/common'
import {Container} from '../../app/models'

class Memento {
  private state: Array<ContainerSchema>

  constructor(state: Array<ContainerSchema>) {
    this.state = state
  }

  getState(): Array<ContainerSchema> {
    return this.state
  }
}

export {Memento}

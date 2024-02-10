import {Memento} from './Memento'

class Caretaker {
  mementos: Memento[] = []

  addMemento(memento: Memento) {
    if (this.mementos.length > 10) {
      this.mementos.shift()
    }

    this.mementos.push(memento)
  }

  getMemento(index: number): Memento {
    return this.mementos[index]
  }

  undo() {
    if (!this.mementos.length) {
      return
    }

    return this.mementos.pop()
  }
}

export {Caretaker}

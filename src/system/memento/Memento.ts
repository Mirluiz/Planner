import { Object3DSchema } from "../../app/system";

class Memento {
  private state: Array<Object3DSchema>;

  constructor(state: Array<Object3DSchema>) {
    this.state = state;
  }

  getState(): Array<Object3DSchema> {
    return this.state;
  }
}

export { Memento };

import { Object3D } from "../../app/model/Object3D";
import { Helpers } from "./../utils/Helpers";

type SceneEvents = "scene_update" | "scene_update_element" | "objects_updated";

type SceneData = {
  scene_update: undefined;
  scene_update_element: Object3D;
  objects_updated: undefined;
};

class EventSystem {
  private _events: {
    [key in string]: Array<{
      id: string;
      callBack: (...args: any[]) => void;
    }>;
  } = {};

  subscribe<T extends SceneEvents>(
    action: T,
    event: (data: SceneData[T]) => void
  ) {
    if (typeof event === "function") {
      if (this._events[action]) {
        this._events[action].push({
          id: Helpers.uuid(),
          callBack: event,
        });
      } else {
        this._events[action] = [
          {
            id: Helpers.uuid(),
            callBack: event,
          },
        ];
      }
    } else {
      console.warn("Event has to be a function!");
    }
  }

  unsubscribe(action: string) {
    if (this._events[action]) {
      delete this._events[action];
    }
  }

  emit<T extends SceneEvents>(action: T, data?: SceneData[T]) {
    if (this._events[action]) {
      this._events[action].map((event) => event.callBack(data));
    }
  }
}
export { EventSystem };

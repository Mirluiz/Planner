import { Entity } from "../../../app/Interfaces";
import {
  Wall as WallModel,
  Pipe as PipeModel,
  Room as RoomModel,
  Door as DoorModel,
  Corner as CornerModel,
} from "../../../app/model";
import { Mesh, BaseMesh } from "./Mesh";
import { Wall, Pipe, Room, Corner, Door } from "../../../app/view";
import { App } from "../../../app/App";
import { Object3D } from "../../../app/model/Object3D";

class Renderer {
  static threeJS(model: Object3D, app: App): Mesh | undefined {
    let ret;

    switch (model.type) {
      case Entity.PIPE:
        ret = new Pipe(<PipeModel>model);
        break;
      case Entity.WALL:
        ret = new Wall(<WallModel>model, app);
        break;
      case Entity.DOOR:
        ret = new Door(<DoorModel>model, app);
        break;
      case Entity.ROOM:
        ret = new Room(<RoomModel>model);
        break;
      case Entity.CORNER:
        ret = new Corner(<CornerModel>model, app);
        break;
      case Entity.FITTING:
      case Entity.RADIATOR:
        break;
    }

    return ret;
  }
}

export { Renderer };

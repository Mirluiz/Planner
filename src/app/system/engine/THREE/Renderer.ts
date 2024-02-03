import { Entity, Geometry, Object3D, Object3DProps } from "../../interfaces";
import {
  Wall as WallModel,
  Pipe as PipeModel,
  Room as RoomModel,
  Door as DoorModel,
  Corner as CornerModel,
} from "../../../model";
import { Mesh, BaseMesh } from "./Mesh";
import { Wall, Pipe, Room, Corner, Door } from "../../../view";
import { App } from "../../../App";

class Renderer {
  static threeJS(model: Object3D, app: App): Mesh | undefined {
    let ret;

    switch (model.type) {
      case Entity.PIPE:
        ret = new Pipe(<PipeModel>model);
        break;
      case Entity.WALL:
        ret = new Wall(<WallModel>model);
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

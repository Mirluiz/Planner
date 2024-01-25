import { Entity, Geometry, Object3D, Object3DProps } from "../../interfaces";
import {
  Wall as WallModel,
  Pipe as PipeModel,
  Room as RoomModel,
  Corner as CornerModel,
} from "../../../model";
import { Mesh, BaseMesh } from "./Mesh";
import { Wall } from "./Models/Wall";
import { Pipe } from "./Models/Pipe";
import { Room } from "./Models/Room";
import { Corner } from "./Models/Corner";
import { App } from "../../../App";

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

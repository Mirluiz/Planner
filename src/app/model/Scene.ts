import { 
  EventSystem, 
} from "../../system";
import { Object3DSchema, Object3D } from "./Object3D";

class Scene {
  event: EventSystem = new EventSystem();

 
  private _objects: Array<Object3D> = [];
  objectsBy: { [key in string]: Object3D } = {};

  constructor() {}

  set objects(objects) {
    this._objects = objects;
    this.updateBy();
  }

  get objects() {
    return this._objects;
  }


  addObject(object: Object3D) {
    this.objects.push(object);
    this.updateBy();
    this.event.emit("objects_updated");
  }

  addSchema(schema: Object3DSchema) {
    // switch (schema.type) {
    //   case Entity.PIPE: {
    //     let object = Pipe.fromJson(schema);
    //     break;
    //   }
    //   case Entity.WALL: {
    //     if (Scene.checkType<Object3DSchemaWall>(schema, Entity.WALL)) {
    //       let object = Wall.fromJson(schema);
    //       if (object) this.addObject(object);
    //     }
    //     break;
    //   }
    //   case Entity.FITTING: {
    //     let object = Fitting.fromJson(schema);
    //     if (object) this.addObject(object);
    //     break;
    //   }
    //   case Entity.CORNER: {
    //     if (Scene.checkType<CornerProps>(schema, Entity.CORNER)) {
    //       let object = Corner.fromJson(schema);
    //       if (object) this.addObject(object);
    //     }

    //     break;
    //   }
    //   case Entity.RADIATOR: {
    //     // let object = Radiator.fromJson();
    //     // this.addObject(new Radiator(schema));
    //     break;
    //   }
    //   case Entity.ROOM: {
    //     let object = Room.fromJson(schema);
    //     if (object) this.addObject(object);
    //     break;
    //   }
    //   case Entity.DOOR: {
    //     if (Scene.checkType<DoorProps>(schema, Entity.DOOR)) {
    //       let object = Door.fromJson(schema);
    //       if (object) this.addObject(object);
    //     }

    //     break;
    //   }
    //   case Entity.WINDOW: {
    //     let object = Window.fromJson(schema);
    //     if (object) this.addObject(object);
    //     break;
    //   }
    // }
  }

  removeObject(uuid: string) {
    let objIndex = this.objects.findIndex((object) => object.uuid === uuid);

    if (objIndex !== -1) {
      this.objects.splice(objIndex, 1);
      this.event.emit("objects_updated");
    }
  }

  static checkType<T>(params: any, typeN: number): params is T {
    return params?.type === typeN;
  }

  private updateBy() {
    this.objects.map((object) => {
      this.objectsBy[object.uuid] = object;
    });
  }
}

export { Scene };

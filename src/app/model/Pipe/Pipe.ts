import {
  Helpers,
  Geometry,
  Entity,
} from "../../../system";
import { Vector3 } from "three";
import { PipeEnd } from "./PipeEnd";
import { Basic3D, Object3DProps, Object3DSchema } from "../Object3D";

class Pipe extends Basic3D implements Geometry.Line {
  isPipe = true
  flow: "red" | "blue";
  start: PipeEnd;
  end: PipeEnd;

  constructor(
    props: {
      start: Vector3;
      end: Vector3;
      flow: "red" | "blue";
    } & Object3DProps
  ) {
    super(props);

    this.start = new PipeEnd(props?.start?.x, props?.start?.y, props?.start?.z);
    this.end = new PipeEnd(props?.end?.x, props?.end?.y, props?.end?.z);

    this.flow = props?.flow ?? "blue";
  }

   
  onUpdate() {
    console.log("2");
  }

  destroy() {
    for (const observer of this.observers) {
      observer.trigger();
    }
  }

  static fromJson(schema: Object3DSchema) {
    // if (!schema.start || !schema.end || !schema.flow) return;
    
    // const pipe = new Pipe({
    //   start: new PipeEnd(schema.start.x, schema.start.y, schema.start.z),
    //   end: new PipeEnd(schema.end.x, schema.end.y, schema.end.z),
    //   flow: schema.flow,
    // });
    
    // pipe.position = schema.position;
    // pipe.rotation = schema.rotation;
    // pipe.uuid = schema.uuid;
    // pipe.dimension = schema.dimension;
    // return pipe;
  }

  toJson() {
    return {
      uuid: this.uuid,
      dimension: this.dimension,
      rotation: this.rotation,
      position: this.position,

      start: { ...this.start, object: this.start.object },
      end: { ...this.end },
      type: Entity.PIPE,
      flow: this.flow,
    };
  }

  clone() {
    return new Pipe({
      ...this.toJson(),
      end: this.end.clone(),
      start: this.start.clone(),
    });
  }

  static createDefault(): Pipe {
    return new Pipe({
      end: new PipeEnd(0, 0, 0),
      start: new PipeEnd(0, 0, 0),
      flow: 'blue',
    });
  }
}

export { Pipe };

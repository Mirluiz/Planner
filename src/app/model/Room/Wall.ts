import {
  Geometry,
  Entity,
  Helpers,
} from "../../../system";
import { Vector3 } from "three";
import { WallEnd } from "./WallEnd";
import { Object3DProps,Basic3D,  Object3DSchema } from "../Object3D";

export type WallProps = {
  start: Geometry.Vector3 & { object: string | null };
  end: Geometry.Vector3 & { object: string | null };
} & Object3DProps;

export type Object3DSchemaWall = Object3DSchema & {
  start: { x: number; y: number; z: number; object: string | null };
  end: { x: number; y: number; z: number; object: string | null };
};

class Wall extends Basic3D implements Geometry.Line {
  isWall = true;
  start: WallEnd;
  end: WallEnd;

  startAngle: number = 0;
  endAngle: number = 0;

  constructor(props: WallProps) {
    super(props);

    this.start = new WallEnd({
      x: props?.start?.x,
      y: props?.start?.y,
      z: props?.start?.z,
      object: props?.start?.object ?? null,
    });
    this.end = new WallEnd({
      x: props?.end?.x,
      y: props?.end?.y,
      z: props?.end?.z,
      object: props?.end?.object ?? null,
    });

    this.type = Entity.WALL;
  }



  update(props: Partial<Object3DProps>) {
    if (props.position) {
      let reservedPosition = { ...this.position };
      this.position = { ...props.position };

      let ln = this.start.distanceTo(this.end);

      let reservedCenterVector = new Vector3(
        reservedPosition.x,
        reservedPosition.y,
        reservedPosition.z,
      );

      let centerVector = new Vector3(
        this.position.x,
        this.position.y,
        this.position.z,
      );

      let fromCenterToStart = this.start.clone().sub(reservedCenterVector);
      let fromCenterToEnd = this.end.clone().sub(reservedCenterVector);

      let startVector = centerVector
        .clone()
        .sub(fromCenterToStart.normalize().multiplyScalar(ln * 0.5));

      let endVector = centerVector
        .clone()
        .sub(fromCenterToEnd.normalize().multiplyScalar(ln * 0.5));

      this.start.set(startVector.x, startVector.y, startVector.z);
      this.end.set(endVector.x, endVector.y, endVector.z);
    }
  }

  updateCenter() {
    let midPoint = new Vector3();

    midPoint
      .addVectors(this.start.clone(), this.end.clone())
      .multiplyScalar(0.5);

    this.position.x = midPoint.x;
    this.position.y = midPoint.y;
    this.position.z = midPoint.z;
  }

  static fromJson(schema: Object3DSchemaWall) {
    if (!schema.start || !schema.end) return;

    const wall = new Wall({
      start: new WallEnd({
        x: schema.start.x,
        y: schema.start.y,
        z: schema.start.z,
        object: schema.start.object,
      }),
      end: new WallEnd({
        x: schema.end.x,
        y: schema.end.y,
        z: schema.end.z,
        object: schema.end.object,
      }),
    });

    // wall.start.object

    wall.position = schema.position;
    wall.rotation = schema.rotation;
    wall.uuid = schema.uuid;
    wall.dimension = schema.dimension;

    return wall;
  }

  toJson(): Object3DSchemaWall {
    return {
      uuid: this.uuid,
      dimension: this.dimension,
      rotation: this.rotation,
      position: this.position,

      start: {
        x: this.start.x,
        y: this.start.y,
        z: this.start.z,
        object: this.start.object,
      },
      end: {
        x: this.end.x,
        y: this.end.y,
        z: this.end.z,
        object: this.end.object,
      },
      type: Entity.WALL,
    };
  }

  clone() {
    let props = this.toJson();
    props.uuid = Helpers.uuid();

    let cloned = Wall.fromJson(props)!;

    cloned.start.object = this.start.object;
    cloned.end.object = this.end.object;

    return cloned;
  }
}

export { Wall };

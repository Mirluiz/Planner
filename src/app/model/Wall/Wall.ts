import {
  Geometry,
  Entity,
  Helpers,
  Object3D,
  Object3DProps,
  Object3DSchema,
} from "../../system";
import { Vector3 } from "three";

class Wall implements Object3D, Geometry.Line {
  isWall = true;

  uuid;
  dimension;
  rotation;
  position;

  type = Entity.WALL;

  start;
  end;

  startAngle: number = 0;
  endAngle: number = 0;

  connections: {
    start: Object | null;
    end: Object | null;
  } = { start: null, end: null };

  constructor(
    props: {
      start: Geometry.Vector3;
      end: Geometry.Vector3;
    } & Object3DProps
  ) {
    this.start = new Vector3(props.start.x, props.start.y, props.start.z);
    this.end = new Vector3(props.end.x, props.end.y, props.end.z);

    this.uuid = props.uuid ?? Helpers.uuid();
    this.dimension = { width: 1, height: 1, depth: 1 };
    this.rotation = props.rotation ?? { w: 0, x: 0, y: 0, z: 0 };
    this.position = props.position ?? { x: 0, y: 0, z: 0 };
  }

  static fromJson(schema: Object3DSchema) {
    if (!schema.start || !schema.end) return;

    const wall = new Wall({
      start: new Vector3(schema.start.x, schema.start.y, schema.start.z),
      end: new Vector3(schema.end.x, schema.end.y, schema.end.z),
    });

    wall.position = schema.position;
    wall.rotation = schema.rotation;
    wall.uuid = schema.uuid;
    wall.dimension = schema.dimension;

    return wall;
  }

  toJson() {
    return {
      uuid: this.uuid,
      dimension: this.dimension,
      rotation: this.rotation,
      position: this.position,

      start: { x: this.start.x, y: this.start.y, z: this.start.z },
      end: { x: this.end.x, y: this.end.y, z: this.end.z },
      type: Entity.WALL,
    };
  }
}

export { Wall };

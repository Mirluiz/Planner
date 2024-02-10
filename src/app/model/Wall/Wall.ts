import {
  Geometry,
  Entity,
  Helpers,
  Object3D,
  Object3DProps,
  Object3DSchema,
  Math2D,
} from "../../system";
import { Vector3 } from "three";
import { Observer } from "../../system/interfaces/Observer";
import { WallEnd } from "./WallEnd";
import { GeometryCalculation } from "../../controller/Wall/GeometryCalculation";
import { Scene } from "../../controller/Scene";

class Wall implements Object3D, Geometry.Line {
  isWall = true;

  uuid;
  dimension;
  rotation;
  position;

  private observers: Observer[] = [];

  type = Entity.WALL;

  start: WallEnd;
  end: WallEnd;

  startAngle: number = 0;
  endAngle: number = 0;

  constructor(
    props?: Partial<
      {
        start: Geometry.Vector3;
        end: Geometry.Vector3;
      } & Object3DProps
    >
  ) {
    this.start = new WallEnd(props?.start?.x, props?.start?.y, props?.start?.z);
    this.end = new WallEnd(props?.end?.x, props?.end?.y, props?.end?.z);

    this.uuid = props?.uuid ?? Helpers.uuid();
    this.dimension = { width: 1, height: 2, depth: 1 };
    this.rotation = props?.rotation ?? { w: 0, x: 0, y: 0, z: 0 };
    this.position = props?.position ?? { x: 0, y: 0, z: 0 };
  }

  addObserver(observer: Observer) {
    this.observers.push(observer);
  }

  notifyObservers() {
    for (const observer of this.observers) {
      observer.trigger();
    }
  }

  update(props: Partial<Object3DProps>) {
    if (props.position) {
      let reservedPosition = { ...this.position };
      this.position = { ...props.position };

      let ln = this.start.distanceTo(this.end);

      let reservedCenterVector = new Vector3(
        reservedPosition.x,
        reservedPosition.y,
        reservedPosition.z
      );

      let centerVector = new Vector3(
        this.position.x,
        this.position.y,
        this.position.z
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

  destroy() {
    for (const observer of this.observers) {
      observer.destroy();
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

  // updateAngle() {
  //   let startWalls = this.start.object?.walls.filter(
  //     (_w) => _w.uuid !== this.uuid
  //   );
  //   let endWalls = this.end.object?.walls.filter((_w) => _w.uuid !== this.uuid);
  //
  //   let prevWall: Wall | undefined;
  //   let nextWall: Wall | undefined;
  //
  //   if (startWalls) {
  //     prevWall = startWalls.sort(
  //       (a, b) =>
  //         Math2D.Calculation.calculateTheta(
  //           new Vector3(a.position.x, a.position.y, a.position.z)
  //         ) -
  //         Math2D.Calculation.calculateTheta(
  //           new Vector3(b.position.x, b.position.y, b.position.z)
  //         )
  //     )[0];
  //   }
  //
  //   if (endWalls) {
  //     nextWall = endWalls.sort(
  //       (a, b) =>
  //         Math2D.Calculation.calculateTheta(
  //           new Vector3(a.position.x, a.position.y, a.position.z)
  //         ) -
  //         Math2D.Calculation.calculateTheta(
  //           new Vector3(b.position.x, b.position.y, b.position.z)
  //         )
  //     )[0];
  //   }
  //
  //   {
  //     if (prevWall) {
  //       let nextWallOppositeEnd =
  //         prevWall.start.object?.uuid === this.start.object?.uuid
  //           ? prevWall.end
  //           : prevWall.start;
  //       let currentNormal = nextWallOppositeEnd
  //         .clone()
  //         .sub(this.start)
  //         .normalize();
  //
  //       let nextNormal = this.end.clone()?.sub(this.start).normalize();
  //
  //       if (currentNormal && nextNormal) {
  //         let angle = GeometryCalculation.angleBetweenVectorsWithOrientation(
  //           currentNormal,
  //           nextNormal
  //         );
  //
  //         this.endAngle = angle / 2 - Math.PI / 2;
  //       }
  //     }
  //   }
  //
  //   {
  //     if (nextWall) {
  //       let prevWallOppositeEnd =
  //         nextWall.start.object?.uuid === this.end.object?.uuid
  //           ? nextWall.end
  //           : nextWall.start;
  //       let currentNormal = prevWallOppositeEnd
  //         .clone()
  //         .sub(this.end)
  //         .normalize();
  //       let nextNormal = this.start.clone()?.sub(this.end).normalize();
  //
  //       if (currentNormal && nextNormal) {
  //         let angle = GeometryCalculation.angleBetweenVectorsWithOrientation(
  //           currentNormal,
  //           nextNormal
  //         );
  //
  //         this.startAngle = angle / 2 - Math.PI / 2;
  //       }
  //     }
  //   }
  // }
  //
  // updateCorners() {
  //   let startCorner = this.start.object;
  //   let endCorner = this.end.object;
  //
  //   if (startCorner) {
  //     startCorner.position = {
  //       x: this.start.x,
  //       y: this.start.y,
  //       z: this.start.z,
  //     };
  //     startCorner.walls.map((wall) => {
  //       if (wall.uuid !== this.uuid && startCorner) {
  //         if (wall.end.object?.uuid === startCorner.uuid) {
  //           wall.end.set(
  //             startCorner.position.x,
  //             startCorner.position.y,
  //             startCorner.position.z
  //           );
  //         }
  //
  //         if (wall.start.object?.uuid === startCorner.uuid) {
  //           wall.start.set(
  //             startCorner.position.x,
  //             startCorner.position.y,
  //             startCorner.position.z
  //           );
  //         }
  //
  //         wall.updateCenter();
  //         wall.notifyObservers();
  //       }
  //     });
  //     startCorner.notifyObservers();
  //   }
  //
  //   if (endCorner) {
  //     endCorner.position = { x: this.end.x, y: this.end.y, z: this.end.z };
  //     endCorner.walls.map((wall) => {
  //       if (wall.uuid !== this.uuid && endCorner) {
  //         if (wall.end.object?.uuid === endCorner.uuid) {
  //           wall.end.set(
  //             endCorner.position.x,
  //             endCorner.position.y,
  //             endCorner.position.z
  //           );
  //         }
  //
  //         if (wall.start.object?.uuid === endCorner.uuid) {
  //           wall.start.set(
  //             endCorner.position.x,
  //             endCorner.position.y,
  //             endCorner.position.z
  //           );
  //         }
  //
  //         wall.updateCenter();
  //         wall.notifyObservers();
  //       }
  //     });
  //     endCorner.notifyObservers();
  //   }
  //
  //   this.updateAngle();
  // }

  static fromJson(schema: Object3DSchema) {
    if (!schema.start || !schema.end) return;

    const wall = new Wall({
      start: new WallEnd(schema.start.x, schema.start.y, schema.start.z),
      end: new WallEnd(schema.end.x, schema.end.y, schema.end.z),
    });

    // wall.start.object

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
      type: this.type,
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

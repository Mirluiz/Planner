import { Vector3 } from "three";
import { Door, Wall as WallModel, Corner as CornerModel } from "../../model";
import { Scene } from "../Scene";

class DoorUpdates {
  static doorsByWall(doors: Array<Door>, wall: WallModel, scene: Scene) {
    doors.map((door) => {
      if (door.attachedWall?.wall.uuid === wall.uuid) {
        let wallPos = new Vector3(wall.start.x, wall.start.y, wall.start.z);
        let normal = wall.start.clone().sub(wall.end).normalize();
        let ln = wall.start.clone().sub(wall.end).length();

        let finalPos = wallPos
          .clone()
          .sub(normal.multiplyScalar(door.attachedWall.centerOffset * ln ?? 1));

        door.position = { x: finalPos.x, y: finalPos.y, z: finalPos.z };
        door.notifyObservers();

        let startCorner = scene.model.objects.find(
          (object) => object.uuid === wall.start.object,
        ) as CornerModel | undefined;

        startCorner?.walls.map((wallUUID) => {
          let _wall = scene.model.objectsBy[wallUUID] as WallModel;

          doors.map((door) => {
            if (door.attachedWall?.wall.uuid === _wall.uuid) {
              let wallPos = new Vector3(
                _wall.start.x,
                _wall.start.y,
                _wall.start.z,
              );
              let normal = _wall.start.clone().sub(_wall.end).normalize();
              let ln = _wall.start.clone().sub(_wall.end).length();

              let finalPos = wallPos
                .clone()
                .sub(
                  normal.multiplyScalar(
                    door.attachedWall.centerOffset * ln ?? 1,
                  ),
                );

              let angle = _wall.end
                .clone()
                .sub(_wall.start.clone())
                .normalize();

              if (door.attachedWall.faceClockwise) {
                door.face = new Vector3(
                  -door.attachedWall.faceClockwise * angle.z,
                  0,
                  door.attachedWall.faceClockwise * angle.x,
                );
              }

              door.position = { x: finalPos.x, y: finalPos.y, z: finalPos.z };
              door.notifyObservers();
            }
          });
        });

        let endCorner = scene.model.objects.find(
          (object) => object.uuid === wall.end.object,
        ) as CornerModel | undefined;

        endCorner?.walls.map((wallUUID) => {
          let _wall = scene.model.objectsBy[wallUUID] as WallModel;

          doors.map((door) => {
            if (door.attachedWall?.wall.uuid === _wall.uuid) {
              let wallPos = new Vector3(
                _wall.start.x,
                _wall.start.y,
                _wall.start.z,
              );
              let normal = _wall.start.clone().sub(_wall.end).normalize();
              let ln = _wall.start.clone().sub(_wall.end).length();

              let finalPos = wallPos
                .clone()
                .sub(
                  normal.multiplyScalar(
                    door.attachedWall.centerOffset * ln ?? 1,
                  ),
                );

              let angle = _wall.end
                .clone()
                .sub(_wall.start.clone())
                .normalize();
              door.rotation.y = Math.PI - Math.atan2(angle.z, angle.x);

              door.position = { x: finalPos.x, y: finalPos.y, z: finalPos.z };
              door.notifyObservers();
            }
          });
        });
      }
    });
  }

  static doorsByCorner(doors: Array<Door>, corner: CornerModel, scene: Scene) {
    doors.map((door) => {
      corner.walls.map((wallUUID) => {
        let _wall = scene.model.objectsBy[wallUUID] as WallModel;
        if (door.attachedWall?.wall.uuid === _wall.uuid) {
          let modelPos = new Vector3(
            _wall.start.x,
            _wall.start.y,
            _wall.start.z,
          );
          let normal = _wall.start.clone().sub(_wall.end).normalize();
          let ln = _wall.start.clone().sub(_wall.end).length();

          let finalPos = modelPos
            .clone()
            .sub(
              normal.multiplyScalar(door.attachedWall.centerOffset * ln ?? 1),
            );

          door.position = { x: finalPos.x, y: finalPos.y, z: finalPos.z };

          let angle = _wall.end.clone().sub(_wall.start.clone()).normalize();

          if (door.attachedWall.faceClockwise) {
            door.face = new Vector3(
              -door.attachedWall.faceClockwise * angle.z,
              0,
              door.attachedWall.faceClockwise * angle.x,
            );
          }

          door.notifyObservers();
        }
      });
    });
  }
}

export { DoorUpdates };

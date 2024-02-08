import { Vector3 } from "three";
import { Door, Wall as WallModel, Corner as CornerModel } from "../../model";

class WallUpdates {
  static updateDoorsByWall(doors: Array<Door>, wall: WallModel) {
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

        wall.start.object?.walls.map((wall) => {
          doors.map((door) => {
            if (door.attachedWall?.wall.uuid === wall.uuid) {
              let wallPos = new Vector3(
                wall.start.x,
                wall.start.y,
                wall.start.z
              );
              let normal = wall.start.clone().sub(wall.end).normalize();
              let ln = wall.start.clone().sub(wall.end).length();

              let finalPos = wallPos
                .clone()
                .sub(
                  normal.multiplyScalar(
                    door.attachedWall.centerOffset * ln ?? 1
                  )
                );

              let angle = wall.end.clone().sub(wall.start.clone()).normalize();
              door.rotation.y = Math.PI - Math.atan2(angle.z, angle.x);

              door.position = { x: finalPos.x, y: finalPos.y, z: finalPos.z };
              door.notifyObservers();
            }
          });
        });

        wall.end.object?.walls.map((wall) => {
          doors.map((door) => {
            if (door.attachedWall?.wall.uuid === wall.uuid) {
              let wallPos = new Vector3(
                wall.start.x,
                wall.start.y,
                wall.start.z
              );
              let normal = wall.start.clone().sub(wall.end).normalize();
              let ln = wall.start.clone().sub(wall.end).length();

              let finalPos = wallPos
                .clone()
                .sub(
                  normal.multiplyScalar(
                    door.attachedWall.centerOffset * ln ?? 1
                  )
                );

              let angle = wall.end.clone().sub(wall.start.clone()).normalize();
              door.rotation.y = Math.PI - Math.atan2(angle.z, angle.x);

              door.position = { x: finalPos.x, y: finalPos.y, z: finalPos.z };
              door.notifyObservers();
            }
          });
        });
      }
    });
  }

  static updateDoorsByCorner(doors: Array<Door>, corner: CornerModel) {
    doors.map((door) => {
      corner.walls.map((wall) => {
        if (door.attachedWall?.wall.uuid === wall.uuid) {
          let modelPos = new Vector3(wall.start.x, wall.start.y, wall.start.z);
          let normal = wall.start.clone().sub(wall.end).normalize();
          let ln = wall.start.clone().sub(wall.end).length();

          let finalPos = modelPos
            .clone()
            .sub(
              normal.multiplyScalar(door.attachedWall.centerOffset * ln ?? 1)
            );

          door.position = { x: finalPos.x, y: finalPos.y, z: finalPos.z };

          let angle = wall.end.clone().sub(wall.start.clone()).normalize();
          door.rotation.y = Math.PI - Math.atan2(angle.z, angle.x);

          door.notifyObservers();
        }
      });
    });
  }
}

export { WallUpdates };

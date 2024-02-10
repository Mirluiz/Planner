import { Vector3 } from "three";
import { Door, Wall as WallModel, Corner as CornerModel } from "../../model";
import { Math2D } from "../../system";
import { GeometryCalculation } from "./GeometryCalculation";
import { Scene as SceneController } from "../../controller/Scene";

class WallUpdates {
  static updateAngle(wall: WallModel, scene: SceneController) {
    let startCorner = scene.model.objects.find(
      (object) => object.uuid === wall.start.object
    ) as CornerModel | undefined;
    let endCorner = scene.model.objects.find(
      (object) => object.uuid === wall.end.object
    ) as CornerModel | undefined;

    let startWalls = startCorner?.walls.filter((_w) => _w.uuid !== wall.uuid);
    let endWalls = endCorner?.walls.filter((_w) => _w.uuid !== wall.uuid);

    let prevWall: WallModel | undefined;
    let nextWall: WallModel | undefined;

    if (startWalls) {
      prevWall = startWalls.sort(
        (a, b) =>
          Math2D.Calculation.calculateTheta(
            new Vector3(a.position.x, a.position.y, a.position.z)
          ) -
          Math2D.Calculation.calculateTheta(
            new Vector3(b.position.x, b.position.y, b.position.z)
          )
      )[0];
    }

    if (endWalls) {
      nextWall = endWalls.sort(
        (a, b) =>
          Math2D.Calculation.calculateTheta(
            new Vector3(a.position.x, a.position.y, a.position.z)
          ) -
          Math2D.Calculation.calculateTheta(
            new Vector3(b.position.x, b.position.y, b.position.z)
          )
      )[0];
    }

    {
      if (prevWall) {
        let nextWallOppositeEnd =
          prevWall.start.object === wall.start.object
            ? prevWall.end
            : prevWall.start;
        let currentNormal = nextWallOppositeEnd
          .clone()
          .sub(wall.start)
          .normalize();

        let nextNormal = wall.end.clone()?.sub(wall.start).normalize();

        if (currentNormal && nextNormal) {
          let angle = GeometryCalculation.angleBetweenVectorsWithOrientation(
            currentNormal,
            nextNormal
          );

          wall.endAngle = angle / 2 - Math.PI / 2;
        }
      }
    }

    {
      if (nextWall) {
        let prevWallOppositeEnd =
          nextWall.start.object === wall.end.object
            ? nextWall.end
            : nextWall.start;
        let currentNormal = prevWallOppositeEnd
          .clone()
          .sub(wall.end)
          .normalize();
        let nextNormal = wall.start.clone()?.sub(wall.end).normalize();

        if (currentNormal && nextNormal) {
          let angle = GeometryCalculation.angleBetweenVectorsWithOrientation(
            currentNormal,
            nextNormal
          );

          wall.startAngle = angle / 2 - Math.PI / 2;
        }
      }
    }
  }

  static updateCorners(updateWall: WallModel, scene: SceneController) {
    let startCorner = scene.model.objects.find(
      (object) => object.uuid === updateWall.start.object
    ) as CornerModel | undefined;
    let endCorner = scene.model.objects.find(
      (object) => object.uuid === updateWall.end.object
    ) as CornerModel | undefined;

    if (startCorner) {
      startCorner.position = {
        x: updateWall.start.x,
        y: updateWall.start.y,
        z: updateWall.start.z,
      };
      startCorner.walls.map((wall) => {
        if (wall.uuid !== updateWall.uuid && startCorner) {
          if (wall.end.object === startCorner.uuid) {
            wall.end.set(
              startCorner.position.x,
              startCorner.position.y,
              startCorner.position.z
            );
          }

          if (wall.start.object === startCorner.uuid) {
            wall.start.set(
              startCorner.position.x,
              startCorner.position.y,
              startCorner.position.z
            );
          }

          wall.updateCenter();
          wall.notifyObservers();
        }
      });
      startCorner.notifyObservers();
    }

    if (endCorner) {
      endCorner.position = {
        x: updateWall.end.x,
        y: updateWall.end.y,
        z: updateWall.end.z,
      };
      endCorner.walls.map((wall) => {
        if (wall.uuid !== updateWall.uuid && endCorner) {
          if (wall.end.object === endCorner.uuid) {
            wall.end.set(
              endCorner.position.x,
              endCorner.position.y,
              endCorner.position.z
            );
          }

          if (wall.start.object === endCorner.uuid) {
            wall.start.set(
              endCorner.position.x,
              endCorner.position.y,
              endCorner.position.z
            );
          }

          wall.updateCenter();
          wall.notifyObservers();
        }
      });
      endCorner.notifyObservers();
    }

    this.updateAngle(updateWall, scene);
  }

  static updateWallsByCorner(
    walls: WallModel[],
    corner: CornerModel,
    scene: SceneController
  ) {
    walls.map((wall) => {
      let startCorner = scene.model.objects.find(
        (object) => object.uuid === wall.start.object
      ) as CornerModel | undefined;
      let endCorner = scene.model.objects.find(
        (object) => object.uuid === wall.end.object
      ) as CornerModel | undefined;

      if (wall.end.object === corner.uuid) {
        wall.end.set(corner.position.x, corner.position.y, corner.position.z);
      } else {
        endCorner?.walls.map((w) => {
          this.updateAngle(w, scene);
          w.notifyObservers();
        });
      }

      if (wall.start.object === corner.uuid) {
        wall.start.set(corner.position.x, corner.position.y, corner.position.z);
      } else {
        startCorner?.walls.map((w) => {
          this.updateAngle(w, scene);
          w.notifyObservers();
        });
      }

      wall.updateCenter();
      this.updateAngle(wall, scene);
      wall.notifyObservers();
    });
  }
}

export { WallUpdates };

import { Drawing, Object3D, Geometry, Math2D } from "../system";
import { Scene as SceneController } from "../controller/Scene";
import { Fitting, Pipe as PipeModel, PipeEnd } from "../model";
import { Vector3 } from "three";

class Pipe implements Drawing {
  readonly scene: SceneController;
  active: PipeModel | null = null;

  private tempFitting: Array<Fitting> = [];

  constructor(props: { scene: SceneController }) {
    this.scene = props.scene;
  }

  get pipes() {
    return this.scene.model.objects.filter((obj): obj is PipeModel => {
      if (obj instanceof PipeModel) {
        return Math2D.Line.isLine(obj);
      } else return false;
    });
  }

  start(pos: { x: number; y: number; z: number }, flow: "red" | "blue") {
    let newPipe = new PipeModel({
      start: new Vector3(pos.x, pos.y, pos.z),
      end: new Vector3(pos.x, pos.y, pos.z),
      flow: flow,
    });

    const closest = newPipe?.start ? this.getClosest(newPipe.start) : null;
    const closestEnd = this.getClosestEnd(newPipe.start);

    if (closestEnd) {
      if (closestEnd.end.object) {
        let fitting = this.scene.model.objects.find(
          (obj) => obj.uuid === closestEnd.end.object
        );
        if (fitting instanceof Fitting) {
          this.tempFitting = this.tempFitting.filter(
            (tF) => tF.uuid !== closestEnd.end.object
          );

          newPipe.start.object = closestEnd.end.object;
          newPipe.start.set(
            closestEnd.end.x,
            closestEnd.end.y,
            closestEnd.end.z
          );
        }
      } else {
        this.connect(newPipe.start, closestEnd.pipe, newPipe.start);
      }
    } else if (newPipe.start && closest && closest?.distance < 1) {
      this.connect(newPipe.start, closest.object, closest.position);
    }

    this.addObject(newPipe);

    this.active = newPipe;

    return newPipe;
  }

  moveEnd(end: Vector3, pos: { x: number; y: number; z: number }) {
    end.set(pos.x, pos.y, pos.z);
  }

  end(pos: { x: number; y: number; z: number }) {
    if (this.active) {
      this.tempFitting = [];
    }

    const closest = this.active ? this.getClosest(this.active.end) : null;
    const closestEnd = this.active
      ? this.getClosestEnd(this.active?.end)
      : null;

    if (this.active && closestEnd?.end.object) {
      let fitting = this.scene.model.objects.find(
        (obj) => obj.uuid === closestEnd.end.object
      );
      if (fitting instanceof Fitting) {
        this.active.end.object = closestEnd.end.object;
        this.active.end.set(
          closestEnd.end.x,
          closestEnd.end.y,
          closestEnd.end.z
        );
      }
    } else {
      if (this.active?.end && closest && closest?.distance < 1) {
        this.connect(this.active.end, closest.object, closest.position);
      }
    }

    this.active = null;
  }

  private getClosest(pipeEnd: PipeEnd): {
    distance: number;
    position: Vector3;
    object: PipeModel;
  } | null {
    let snapsByDistance = Math2D.Line.sortDistance(this.pipes, pipeEnd);

    let excludeItself = snapsByDistance.filter(
      (snap) => snap.object.uuid !== this.active?.uuid
    );

    const closestPipe = excludeItself[0];

    return closestPipe ?? null;
  }

  private getClosestEnd(
    end: PipeEnd
  ): { pipe: PipeModel; end: PipeEnd } | null {
    let pipes = this.scene.model.objects.filter(
      (obj) => obj instanceof PipeModel
    );

    let closest: { pipe: PipeModel; end: PipeEnd } | null = null;

    pipes.find((pipe) => {
      if (pipe instanceof PipeModel) {
        if (pipe.end.distanceTo(end) < 0.5) {
          closest = { end: pipe.end, pipe };
          return true;
        } else if (pipe.start.distanceTo(end) < 0.5) {
          closest = { end: pipe.start, pipe };
          return true;
        }
      }
    });

    return closest ?? null;
  }

  private isItPipeEnd(pipe: PipeModel, pos: Vector3): PipeEnd | null {
    let end =
      pipe.end.distanceTo(pos) < 0.5
        ? pipe.end
        : pipe.start.distanceTo(pos) < 0.5
        ? pipe.start
        : null;

    return end;
  }

  private connect(pipeEnd: PipeEnd, pipe: PipeModel, snapPos: Vector3) {
    const snapPosNet = Math2D.NetAlgorithms.netBind(
      new Vector3(snapPos.x, snapPos.y, snapPos.z)
    );

    let fitting = new Fitting({
      position: { ...snapPosNet },
    });

    if (this.isItPipeEnd(pipe, snapPos)) {
      let end = this.isItPipeEnd(pipe, snapPos);
      this.addObject(fitting);
      if (this.active) this.active.end.object = fitting.uuid;

      if (end) {
        end.object = fitting.uuid;
        this.tempFitting.push(fitting);
      }
    } else {
      let dividedPipeToFitting = new PipeModel({
        start: new Vector3(snapPosNet.x, snapPosNet.y, snapPosNet.z),
        end: new Vector3(snapPosNet.x, snapPosNet.y, snapPosNet.z),
        flow: pipe.flow,
      });

      dividedPipeToFitting.start = pipe.start;
      dividedPipeToFitting.end.set(snapPosNet.x, snapPosNet.y, snapPosNet.z);
      dividedPipeToFitting.end.object = fitting.uuid;

      let dividedPipeFromFitting = new PipeModel({
        start: new Vector3(),
        end: new Vector3(pipe.end.x, pipe.end.y, pipe.end.z),
        flow: pipe.flow,
      });
      dividedPipeFromFitting.start = pipe.end;
      dividedPipeFromFitting.end.set(snapPosNet.x, snapPosNet.y, snapPosNet.z);
      dividedPipeFromFitting.start.object = fitting.uuid;

      this.addObject(dividedPipeToFitting);
      this.addObject(dividedPipeFromFitting);
      this.addObject(fitting);

      this.scene.model.removeObject(pipe.uuid);
      pipe.destroy();

      this.active?.end.set(snapPosNet.x, snapPosNet.y, snapPosNet.z);
    }
  }

  clearTempFitting() {
    this.tempFitting.map((fitting) => {
      let pipes = this.scene.model.objects.filter(
        (obj) => obj instanceof PipeModel
      );

      pipes.map((pipe) => {
        if (pipe instanceof PipeModel) {
          if (pipe?.end?.object === fitting.uuid) pipe.end.object = null;
          if (pipe.start?.object === fitting.uuid) pipe.start.object = null;
        }
      });

      this.scene.model.removeObject(fitting.uuid);
    });
  }

  private addObject(object: Object3D) {
    this.scene.model.addObject(object);
  }

  reset() {
    if (this.active) {
      this.clearTempFitting();

      this.scene.model.removeObject(this.active.uuid);
      this.active?.destroy();
      this.active = null;
    }
  }

  startDraw() {}

  draw() {}
}

export { Pipe };

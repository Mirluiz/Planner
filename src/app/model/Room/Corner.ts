import {
  Entity,
} from "../../../system";
import { Basic3D, Object3DProps } from "../Object3D";

export type CornerProps = Object3DProps & { walls: Array<string> };

class Corner extends Basic3D {
  walls: Array<string> = [];

  constructor(props: Partial<CornerProps>) {
    super(props);

    this.walls = props?.walls ?? [];
    this.type =  Entity.CORNER;
  }

  static fromJson(schema: CornerProps) {
    return new Corner({ ...schema });
  }

  toJson() {
    return {
      uuid: this.uuid,
      dimension: this.dimension,
      rotation: this.rotation,
      position: this.position,
      type: Entity.CORNER,
      walls: [...this.walls],
    };
  }

  clone() {
    return new Corner(this.toJson());
  }
}

export { Corner };

// import { Line as LineModel, Vector3 } from "./../../service/geometry";
// import { Scene as SceneController } from "../controller/Scene";
// import { MathHelper } from "../service/MathHelper";
//
// class Line<Object extends LineModel> {
//   active: Object | null = null;
//   scene: SceneController;
//   lines: Array<Object> = [];
//
//   constructor(props: { scene: SceneController; objects: Array<Object> }) {
//     this.scene = props.scene;
//     this.lines = props.objects;
//   }
//
//   protected sortDistance(vec: Vector3) {
//     let snapsByDistance: Array<{
//       distance: number;
//       position: Vector3;
//       object: Object;
//     }> = [];
//
//     this.lines.map((line) => {
//       let projection = MathHelper.vectorLineIntersectionPosition(
//         new Vector3(vec.x, vec.y, vec.z),
//         {
//           start: line.start,
//           end: line.end,
//         }
//       );
//
//       if (projection) {
//         let intersect = {
//           ...projection,
//           object: line,
//         };
//
//         snapsByDistance.push(intersect);
//       }
//     });
//
//     snapsByDistance.sort((a, b) => {
//       if (a.distance < b.distance) return -1;
//       return 0;
//     });
//
//     return snapsByDistance ?? null;
//   }
//
//   protected getEnd(
//     end: Vector3
//   ): { object: Object; end: "start" | "end" } | null {
//     let closest: { object: LineModel; end: "start" | "end" } | null = null;
//
//     this.lines.find((line) => {
//       if (line.end.distanceTo(end) < 0.5) {
//         closest = { end: "end", object: line };
//         return true;
//       } else if (line.start.distanceTo(end) < 0.5) {
//         closest = { end: "start", object: line };
//         return true;
//       }
//     });
//
//     return closest ?? null;
//   }
//
//   protected isEnd(line: Object, pos: Vector3): "start" | "end" | null {
//     return line.end.distanceTo(pos) < 0.5
//       ? "end"
//       : line.start.distanceTo(pos) < 0.5
//       ? "start"
//       : null;
//   }
//
//   protected isLine(obj: any): obj is Object {
//     return obj && "start" in obj;
//   }
// }
//
// export { Line };

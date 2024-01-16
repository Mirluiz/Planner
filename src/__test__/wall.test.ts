// import { describe, test } from "@jest/globals";
// import { Math2D } from "../app/system";
// import { Wall } from "./../app/model/Wall/Wall";
// import * as THREE from "three";
// import { App } from "../app/App";
//
// describe("Wall controller processes", () => {
//   function createWall(
//     startPos: { x: number; y: number; z: number },
//     endPos: { x: number; y: number; z: number }
//   ) {
//     let start = new THREE.Vector3(startPos.x, startPos.y, startPos.z);
//     let end = new THREE.Vector3(endPos.x, endPos.y, endPos.z);
//
//     return new Wall({ start, end, position: { x: 0, y: 0, z: 0 } });
//   }
//
//   function createActiveWall() {
//     return createWall({ x: -4, y: 0, z: 4 }, { x: -4, y: 0, z: 4 });
//   }
//
//   test("Wall start to another wall start", () => {});
//   test("Wall end to another wall start", () => {});
//   test("Wall start to another wall end", () => {});
//   test("Wall end to another wall end", () => {});
//
//   test("Wall start to another wall body", () => {});
//   test("Wall end to another wall body", () => {});
//
//   test("Wall end to corner", () => {});
//   test("Wall end to corner with multiply walls", () => {});
//
//   test("Wall end to pick closest from multiply walls", () => {});
// });

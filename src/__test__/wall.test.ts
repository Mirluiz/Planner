import { describe, test } from "@jest/globals";
import { Math2D } from "../app/system";
import { Wall } from "./../app/model/Wall/Wall";
import * as THREE from "three";

describe("Wall processes", () => {
  test("Wall start to another wall start", () => {});
  test("Wall end to another wall start", () => {});
  test("Wall start to another wall end", () => {});
  test("Wall end to another wall end", () => {});

  test("Wall start to another wall body", () => {});
  test("Wall end to another wall body", () => {});

  test("Wall end to corner", () => {});
  test("Wall end to corner with multiply walls", () => {});

  test("Wall end to pick closest from multiply walls", () => {});
});

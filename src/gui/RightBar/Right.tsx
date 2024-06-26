import React, { useEffect, useRef, useState } from "react";
import { Grid, ListItem } from "@mui/material";
import { useSceneContext } from "../System/PiperContext";
import { Corner, Wall } from "../../app/model";
import { LineType } from "./ActiveModel/LineType";
import { Object3D } from "./ActiveModel/Object3D";
import { Room } from "./ActiveModel/Room";

const Right = () => {
  const { app } = useSceneContext();
  const [corners, setCorners] = useState<Corner[]>([]);
  const [walls, setWalls] = useState<Wall[]>([]);

  useEffect(() => {
    app?.sceneController.model.event.subscribe("objects_updated", () => {
      let _corners: Corner[] = [];
      let _walls: Wall[] = [];

      app?.sceneController.model.objects.map((child) => {
        if (child instanceof Corner) {
          _corners.push(child);
          return;
        }
      });

      app?.sceneController.model.objects.map((child) => {
        if (child instanceof Wall) {
          _walls.push(child);
          return;
        }
      });

      setCorners(_corners);
      setWalls(_walls);
    });
  }, [app]);

  return (
    <Grid container>
      <Room />
      <Object3D />
      <LineType />
    </Grid>
  );
};

export { Right };

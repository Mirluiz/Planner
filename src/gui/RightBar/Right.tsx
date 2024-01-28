import React, { useEffect, useRef, useState } from "react";
import { Grid, ListItem } from "@mui/material";
import { useSceneContext } from "../System/PiperContext";
import ListSubheader from "@mui/material/ListSubheader";
import List from "@mui/material/List";
import ListItemText from "@mui/material/ListItemText";
import { Corner, Wall } from "../../app/model";

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
    <Grid
      container
      sx={{
        height: 500,
        overflow: "scroll",
      }}
    >
      <Grid sx={{ width: "50%" }}>
        <List
          sx={{
            width: "100%",
            maxWidth: 360,
            bgcolor: "background.paper",
          }}
          component="nav"
          aria-labelledby="nested-list-subheader"
          subheader={
            <ListSubheader component="div" id="nested-list-subheader">
              Nested List Items
            </ListSubheader>
          }
        >
          {corners.map((corner) => {
            let secondary = corner.walls.map((a) => a.uuid.slice(0, 3));

            return (
              <ListItem key={corner.uuid}>
                <ListItemText
                  primary={corner.uuid.slice(0, 3)}
                  secondary={secondary.join("-")}
                />
              </ListItem>
            );
          })}
        </List>
      </Grid>
      <Grid sx={{ width: "50%" }}>
        <List
          sx={{
            width: "100%",
            maxWidth: 360,
            bgcolor: "background.paper",
          }}
          component="nav"
          aria-labelledby="nested-list-subheader"
          subheader={
            <ListSubheader component="div" id="nested-list-subheader">
              Nested List Items
            </ListSubheader>
          }
        >
          {walls.map((wall) => {
            let secondary: string = "";

            if (wall.start.object) {
              secondary += `start ${wall.start.object.uuid.slice(0, 3)}`;
            }

            secondary += " ";

            if (wall.end.object) {
              secondary += `end ${wall.end.object.uuid.slice(0, 3)}`;
            }

            return (
              <ListItem key={wall.uuid}>
                <ListItemText
                  primary={wall.uuid.slice(0, 3)}
                  secondary={secondary}
                />
              </ListItem>
            );
          })}
        </List>
      </Grid>
    </Grid>
  );
};

export { Right };

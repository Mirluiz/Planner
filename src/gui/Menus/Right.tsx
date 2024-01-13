import React, { useEffect, useRef, useState } from "react";
import { Grid, ListItem } from "@mui/material";
import { useSceneContext } from "../System/PiperContext";
import ListSubheader from "@mui/material/ListSubheader";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import DraftsIcon from "@mui/icons-material/Drafts";
import SendIcon from "@mui/icons-material/Send";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import StarBorder from "@mui/icons-material/StarBorder";
import { Corner } from "../../app/model";

const Right = () => {
  const { app } = useSceneContext();
  const [corners, setCorners] = useState<Corner[]>([]);

  useEffect(() => {
    app?.sceneController.model.event.subscribe("objects_updated", () => {
      let _corners: Corner[] = [];

      app?.sceneController.model.objects.map((child) => {
        if (child instanceof Corner) {
          _corners.push(child);
          return;
        }
      });

      setCorners(_corners);
    });
  }, [app]);

  return (
    <Grid
      container
      sx={{
        background: "red",
      }}
    >
      <List
        sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}
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
  );
};

export { Right };

import React, { useEffect, useRef, useState } from "react";
import { Grid, ListItem } from "@mui/material";
import { useSceneContext } from "../../System/PiperContext";
import { Pipe, Wall } from "../../../app/model";

const LineType = () => {
  const { app } = useSceneContext();
  const [active, setActive] = useState<null | Wall | Pipe>();

  useEffect(() => {
    app?.sceneController.model.event.subscribe("objects_updated", () => {
      app?.sceneController.model.objects.map((child) => {
        if (child.active && ) {
          setActive(child);
          return;
        }
      });
    });
  }, [app]);

  return (
    <Grid
      container
      sx={{
        height: 500,
        border: "1px solid black",
        overflow: "scroll",
      }}
    ></Grid>
  );
};

export { LineType };

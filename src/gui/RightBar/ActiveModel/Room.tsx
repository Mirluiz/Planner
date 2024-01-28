import React, { useEffect, useState } from "react";
import { Grid, Typography } from "@mui/material";
import { useSceneContext } from "../../System/PiperContext";
import { Room as RoomModel } from "../../../app/model";
import { Lang } from "../../../app/system/utils/Lang";

const Room = () => {
  const { app } = useSceneContext();
  const [focused, setFocused] = useState<null | RoomModel>();

  useEffect(() => {
    app?.sceneController.model.event.subscribe("objects_updated", () => {
      let focusedElement = null;

      app?.sceneController.model.objects.map((child) => {
        if (child.focused && child instanceof RoomModel) {
          focusedElement = child;
          return;
        }
      });

      setFocused(focusedElement);
    });
  }, [app]);

  return (
    <>
      {focused && (
        <Grid
          sx={{
            display: "flex",
            flexDirection: "column",
            border: "1px solid black",
            overflowY: "scroll",
            width: "100%",
            gap: 2,
          }}
        >
          <Typography>Название {Lang.ROOM}</Typography>
          <Typography>Площадь {focused.getArea().toFixed(2)}m</Typography>
        </Grid>
      )}
    </>
  );
};

export { Room };

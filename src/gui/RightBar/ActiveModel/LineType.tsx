import React, { useEffect, useRef, useState } from "react";
import { Grid, ListItem, Typography } from "@mui/material";
import { useSceneContext } from "../../System/PiperContext";
import { Pipe, Wall } from "../../../app/model";
import { Entity, Object3D } from "../../../app/system";
import { Lang } from "../../../app/system/utils/Lang";

const LineType = () => {
  const { app } = useSceneContext();
  const [active, setActive] = useState<null | Wall | Pipe>();

  useEffect(() => {
    app?.sceneController.model.event.subscribe("objects_updated", () => {
      let activeElement = null;

      app?.sceneController.model.objects.map((child) => {
        if (child.active && child instanceof Wall) {
          activeElement = child;
          return;
        }
      });

      setActive(activeElement);
    });
  }, [app]);

  const getNameByType = (type: Entity) => {
    let ret = "";

    switch (type) {
      case Entity.PIPE:
        ret = Lang.PIPE;
        break;
      case Entity.WALL:
        ret = Lang.WALL;
        break;
      default:
        ret = "unknown";
    }

    return ret;
  };

  const getNameByObject = (object: Object3D) => {
    let ret = "";

    switch (object.type) {
      case Entity.CORNER:
        ret = Lang.CORNER;
        break;
      case Entity.FITTING:
        ret = Lang.FITTING;
        break;
      default:
        ret = "unknown";
    }

    return ret;
  };

  return (
    <>
      {active && (
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
          <Typography>
            Object {active?.type && getNameByType(active.type)}
          </Typography>
          <Typography>
            Start {active?.start.object && getNameByObject(active.start.object)}
          </Typography>
          <Typography>
            End {active?.end.object && getNameByObject(active.end.object)}
          </Typography>
        </Grid>
      )}
    </>
  );
};

export { LineType };

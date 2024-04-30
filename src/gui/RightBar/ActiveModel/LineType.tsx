import React, { useEffect, useRef, useState } from "react";
import { Grid, ListItem, Typography } from "@mui/material";
import { useSceneContext } from "../../System/PiperContext";
import { Pipe, Wall } from "../../../app/model";
import { Lang } from "../../../system/utils/Lang";
import { Object3D } from "../../../app/model/Object3D";
import { Entity } from "../../../system";

const LineType = () => {
  const { app } = useSceneContext();
  const [focused, setFocused] = useState<null | Wall | Pipe>();

  useEffect(() => {
    app?.sceneController.model.event.subscribe("objects_updated", () => {
      let focusedElement = null;

      app?.sceneController.view?.engine?.scene.children.map((child) => {
        if (
          child.userData?.object?.focused &&
          child.userData?.object.model instanceof Wall
        ) {
          focusedElement = child.userData?.object.model;
          return;
        }
      });

      setFocused(focusedElement);
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

  const getNameByObject = (str: string) => {
    let object = app?.sceneController.model.objects.find(
      (object) => object.uuid === str,
    ) as Object3D;
    let ret = "";
    console.log("object", object);

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
      {focused && (
        <Grid
          className={"noselect"}
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
            Название - {focused?.type && getNameByType(focused.type)}
          </Typography>
          <Typography>
            Начало -
            {focused?.start.object && getNameByObject(focused.start.object)}
          </Typography>
          <Typography>
            Конец - {focused?.end.object && getNameByObject(focused.end.object)}
          </Typography>
        </Grid>
      )}
    </>
  );
};

export { LineType };

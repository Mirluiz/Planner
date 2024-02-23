import React, { useEffect, useRef, useState } from "react";
import { Grid, ListItem, Typography } from "@mui/material";
import { useSceneContext } from "../../System/PiperContext";
import { Corner, Pipe, Wall } from "../../../app/model";
import { Entity } from "../../../app/system";
import { Lang } from "../../../app/system/utils/Lang";

const Object3D = () => {
  const { app } = useSceneContext();
  const [focused, setFocused] = useState<null | Corner>();
  const [connectedElements, setConnectedElements] = useState<null | Wall[]>(
    null,
  );

  useEffect(() => {
    app?.sceneController.model.event.subscribe("objects_updated", () => {
      let focused: Corner | undefined;

      app?.sceneController.view?.engine?.scene.children.map((child) => {
        if (
          child.userData?.object?.focused &&
          child.userData?.object.model instanceof Corner
        ) {
          focused = child.userData.object.model;
          getConnectedElements(focused);
          return;
        }
      });

      setFocused(focused);
    });
  }, [app]);

  const getConnectedElements = (focused: Corner | undefined) => {
    let connectedElements: Wall[] = [];

    focused?.walls.map((wall) => {
      let object = app?.sceneController.model.objects.find(
        (object) => object.uuid === wall,
      );

      if (object) {
        connectedElements.push(object as Wall);
      }
    });

    setConnectedElements(connectedElements);
  };

  const getNameByType = (type: Entity) => {
    let ret = "";

    switch (type) {
      case Entity.PIPE:
        ret = Lang.PIPE;
        break;
      case Entity.WALL:
        ret = Lang.WALL;
        break;
      case Entity.CORNER:
        ret = Lang.CORNER;
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
            Элементы -{" "}
            {connectedElements?.map((conElement) => {
              return (
                <Grid key={conElement.uuid}>
                  Элементы {conElement.uuid.slice(0, 3)}
                </Grid>
              );
            })}
          </Typography>
        </Grid>
      )}
    </>
  );
};

export { Object3D };

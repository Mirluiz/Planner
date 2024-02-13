import React, { useState } from "react";
import { Button, Grid } from "@mui/material";
import UndoOutlinedIcon from "@mui/icons-material/UndoOutlined";
import RedoOutlinedIcon from "@mui/icons-material/RedoOutlined";
import ThreeDRotationOutlinedIcon from "@mui/icons-material/ThreeDRotationOutlined";
import BorderClearIcon from "@mui/icons-material/BorderClear";
import { useSceneContext } from "../System/PiperContext";

const Top = () => {
  const { app, database, setBackDrop } = useSceneContext();

  const [camera, setCamera] = useState<"3D" | "2D">("3D");
  const [netBinding, setNetBinding] = useState<boolean>(false);

  return (
    <Grid
      container
      sx={{
        height: "100%",
        borderBottom: ".5px solid whitesmoke",
      }}
    >
      <Grid>
        <Button
          size={"small"}
          onClick={() => {
            database?.save([], () => {
              app?.sceneController.event.emit("scene_update");
            });
          }}
        >
          New
        </Button>
        <Button
          size={"small"}
          onClick={() => {
            let schemas = app?.sceneController.model.objects.map((object) =>
              object.toJson()
            );

            if (schemas) {
              setBackDrop(true);

              database?.save(schemas, () => {
                setBackDrop(false);
              });
            }
          }}
        >
          Save
        </Button>
        <Button size={"small"}>Export</Button>
        <Button size={"small"}>Catalog</Button>
      </Grid>

      <Grid
        sx={{
          marginLeft: 8,
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 2,
        }}
      >
        <UndoOutlinedIcon color={"info"} />
        <RedoOutlinedIcon color={"info"} />
      </Grid>

      <Grid
        sx={{
          marginLeft: 8,
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 2,
        }}
      >
        <ThreeDRotationOutlinedIcon
          color={camera === "3D" ? "info" : "disabled"}
          fontSize={"small"}
          onClick={() => {
            if (!app) {
              return;
            }

            app.sceneController.view?.engine?.setCamera(
              app.sceneController.view?.engine.cameraMode === "3D" ? "2D" : "3D"
            );
            app.sceneController.event.emit("scene_update");

            if (app.sceneController.view?.engine)
              setCamera(app.sceneController.view?.engine?.cameraMode);
          }}
        />
        <BorderClearIcon
          color={netBinding ? "info" : "disabled"}
          fontSize={"small"}
          onClick={() => {
            if (!app) {
              return;
            }

            app.sceneController.view?.engine?.updateGrid(
              !app.sceneController.view?.engine.netBinding
            );

            setNetBinding(
              app.sceneController.view?.engine?.netBinding ?? false
            );
          }}
        />
      </Grid>
    </Grid>
  );
};

export { Top };

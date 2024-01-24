import React, { useEffect, useRef, useState } from "react";
import { Grid } from "@mui/material";
import { App as PiperApp } from "./../app/App";
import { SceneProviderContext } from "./System/PiperContext";
import { Left } from "./Menus/Left";
import { BottomBar } from "./Menus/BottomBar";
import { Right } from "./Menus/Right";
import { Top } from "./Menus/Top";
import { Room } from "../Demo/Room/Room";
import { Wall } from "../Demo/Wall";
import { Vector3 } from "three";
import { Line } from "../app/system/engine/THREE/Indicator/Line";

const App = () => {
  const canvasRef = useRef<HTMLDivElement | null>(null);
  const [app, setApp] = useState<PiperApp | null>(null);

  useEffect(() => {
    if (canvasRef.current) {
      setApp(new PiperApp({ canvas: canvasRef.current }));
    }
  }, []);

  useEffect(() => {
    if (app) {
      app.init().then(() => {
        app.run();
        const demo = new Room({ app });
        // const corner = new Corner({ app });
        const wall = new Wall({ app });

        let start = new Vector3(2, 0, 0);
        let end = new Vector3(5, 0, 4);
        let line = new Line({ start, end });
        app.sceneController.view?.engine.scene.add(line.render());

        // demo.run();
        // corner.run();
        // wall.run();

        // app.sceneController.event.emit("scene_update");
      });

      // @ts-ignore
      window.app = app;
    }
  }, [app]);

  return (
    <SceneProviderContext.Provider value={{ app }}>
      <Grid
        sx={{
          height: "100vh",
          width: "100vw",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Grid sx={{ height: "30px" }}>
          <Top />
        </Grid>
        <Grid sx={{ flex: 9, display: "flex" }}>
          <Grid sx={{ flexBasis: "50px" }}>
            <Left />
          </Grid>
          <Grid sx={{ flex: 1 }}>
            <Grid
              style={{ width: "100%", height: "100%" }}
              ref={(r) => {
                canvasRef.current = r;
              }}
            ></Grid>
          </Grid>
          <Grid sx={{ flexBasis: "200px" }}>
            <Right />
          </Grid>
        </Grid>
        <Grid sx={{ height: "20px" }}>
          <BottomBar />
        </Grid>
      </Grid>
    </SceneProviderContext.Provider>
  );
};

export { App };

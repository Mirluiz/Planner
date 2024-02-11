import React, { useEffect, useRef, useState } from "react";
import { Grid } from "@mui/material";
import { App as PiperApp } from "./../app/App";
import { SceneProviderContext } from "./System/PiperContext";
import { Left } from "./LeftBar/Left";
import { BottomBar } from "./BottomBar/BottomBar";
import { Right } from "./RightBar/Right";
import { Top } from "./TopBar/Top";
import { Room } from "../Demo/Room/Room";
import { Wall } from "../Demo/Wall";
import * as THREE from "three";
import { Angle } from "../Demo/Angle";
import { Brush, Evaluator, SUBTRACTION } from "three-bvh-csg";
import { Door } from "../Demo/Doors";
import { GlbManager } from "../app/system/engine/THREE/GlbManager";
import { Database } from "../system/Database";
import BackDrop from "./Components/BackDrop";

const App = () => {
  const [backDrop, setBackDrop] = useState<boolean>(false);
  const canvasRef = useRef<HTMLDivElement | null>(null);
  const [app, setApp] = useState<PiperApp | null>(null);
  const [database, setDatabase] = useState<Database | null>(null);

  useEffect(() => {
    if (canvasRef.current) {
      let app = new PiperApp({ canvas: canvasRef.current });
      setApp(app);

      let database = new Database();
      database.init(app, () => {
        setDatabase(database);
        app.sceneController.event.emit("scene_update");
      });
    }
  }, []);

  useEffect(() => {
    if (app) {
      GlbManager.init();
      app.init().then(() => {
        app.run();
        const demo = new Room({ app });
        const angle = new Angle({ app });
        // const corner = new Corner({ app });
        const wall = new Wall({ app });
        const door = new Door({ app });

        // let start = new Vector3(2, 0, 0);
        // let end = new Vector3(5, 0, 4);
        // let line = new Line({ start, end });
        // app.sceneController.view?.engine.scene.add(line.render());

        // const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        //
        // const brush1 = new Brush(new THREE.BoxGeometry(1, 1, 1));
        // brush1.updateMatrixWorld();
        // brush1.material = material;
        //
        // const brush2 = new Brush(new THREE.BoxGeometry());
        // brush2.position.y = 0.5;
        // brush2.updateMatrixWorld();
        // //
        // const evaluator = new Evaluator();
        // const result = evaluator.evaluate(brush1, brush2, SUBTRACTION);

        // demo.run();
        // door.run();
        // angle.run();
        // corner.run();
        // wall.run();

        app.sceneController.event.emit("scene_update");
        // app.sceneController.view?.engine.scene.add(result);
      });

      // @ts-ignore
      window.app = app;
    }
  }, [app]);

  return (
    <SceneProviderContext.Provider value={{ app, database, setBackDrop }}>
      <BackDrop open={backDrop} />
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

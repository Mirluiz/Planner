import React, { useEffect, useRef, useState } from "react";
import { Grid } from "@mui/material";
import { App as PiperApp } from "./../app/App";

const Canvas = () => {
  const canvasRef = useRef<HTMLDivElement | null>(null);
  const [app, setApp] = useState<PiperApp | null>(null);

  useEffect(() => {
    if (canvasRef.current) {
      setApp(new PiperApp({ canvas: canvasRef.current }));
    }
  }, []);

  useEffect(() => {
    if (app) {
      app.run();
    }
  }, [app]);

  return (
    <Grid
      style={{
        height: "100%",
      }}
    >
      <Grid
        style={{ width: "100%", height: "100%" }}
        ref={(r) => {
          canvasRef.current = r;
        }}
      ></Grid>
    </Grid>
  );
};

export { Canvas };

// import React, { useEffect, useRef, useState } from "react";
// import { Button, Grid, Typography } from "@mui/material";
// import { App as PiperApp } from "./../app/App";
// import { Fitting, Pipe } from "../app/model";
// import { SceneProviderContext } from "./System/PiperContext";
//
// const App = () => {
//   const canvasRef = useRef<HTMLDivElement | null>(null);
//   const [app, setApp] = useState<PiperApp | null>(null);
//
//   useEffect(() => {
//     if (canvasRef.current) {
//       setApp(new PiperApp({ canvas: canvasRef.current }));
//     }
//   }, []);
//
//   useEffect(() => {
//     if (app) {
//       app.run();
//     }
//   }, [app]);
//
//   return (
//     <SceneProviderContext.Provider value={{ app }}>
//       <Grid
//         style={{
//           display: "flex",
//           justifyContent: "center",
//           alignItems: "center",
//           height: "600px",
//           gap: 8,
//         }}
//       >
//         <Grid
//           style={{ width: "1200px", height: "100%" }}
//           ref={(r) => {
//             canvasRef.current = r;
//           }}
//         ></Grid>
//         <Grid
//           sx={{
//             display: "flex",
//             flexDirection: "column",
//             alignItems: "flex-start",
//             height: "100%",
//           }}
//         >
//           <Grid>
//             <Typography>
//               Pipes{" "}
//               {
//                 app?.sceneController.model.objects.filter(
//                   (object) => object instanceof Pipe
//                 ).length
//               }
//             </Typography>
//             <Typography>
//               Fittings{" "}
//               {
//                 app?.sceneController.model.objects.filter(
//                   (object) => object instanceof Fitting
//                 ).length
//               }
//             </Typography>
//           </Grid>
//           <Grid
//             sx={{
//               display: "flex",
//               flexDirection: "column",
//             }}
//           >
//             <Button
//               style={{ background: "red", color: "white" }}
//               onClick={() => {
//                 if (app) app.sceneView.drawingMode = "red_pipe";
//               }}
//             >
//               Red pipe Mode
//             </Button>
//             <Button
//               style={{ background: "blue", color: "white" }}
//               onClick={() => {
//                 if (app) {
//                   app.sceneView.controls.enabled = false;
//                   app.sceneView.drawingMode = "blue_pipe";
//                 }
//               }}
//             >
//               Blue pipe Mode
//             </Button>
//             <Button
//               onClick={() => {
//                 if (app) {
//                   app.sceneView.controls.enabled = false;
//                   app.sceneView.drawingMode = "object";
//                 }
//               }}
//             >
//               Radiator Mode
//             </Button>
//             <Button
//               style={{ background: "grey", color: "black" }}
//               onClick={() => {
//                 if (app) {
//                   app.sceneView.controls.enabled = false;
//                   app.sceneView.drawingMode = "wall";
//                 }
//               }}
//             >
//               Blue pipe Mode
//             </Button>
//
//             <Button
//               onClick={() => {
//                 if (app) {
//                   app.save();
//                 }
//               }}
//             >
//               Save
//             </Button>
//             <Button
//               onClick={() => {
//                 if (app) {
//                   app.reset();
//                 }
//               }}
//             >
//               Reset
//             </Button>
//
//             <Button
//               onClick={() => {
//                 if (app) {
//                   app?.wallController.updateHalfEdgeRelations();
//                 }
//               }}
//             >
//               Update halfedges
//             </Button>
//           </Grid>
//         </Grid>
//       </Grid>
//     </SceneProviderContext.Provider>
//   );
// };
//
// export { App };

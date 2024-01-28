import React from "react";
import { Grid } from "@mui/material";
import BathtubOutlinedIcon from "@mui/icons-material/BathtubOutlined";
import BedroomParentOutlinedIcon from "@mui/icons-material/BedroomParentOutlined";
import HvacOutlinedIcon from "@mui/icons-material/HvacOutlined";
import OtherHousesOutlinedIcon from "@mui/icons-material/OtherHousesOutlined";
import { House } from "./SubMenus/House";

const Left = () => {
  return (
    <>
      <Grid
        sx={{
          height: "100%",
          width: "100%",
          display: "flex",
          borderRight: ".5px solid whitesmoke",
          flexDirection: "column",
          alignItems: "center",
          gap: 1,
        }}
      >
        <House />
        <BedroomParentOutlinedIcon fontSize={"large"} />
        <BathtubOutlinedIcon fontSize={"large"} />
        <HvacOutlinedIcon fontSize={"large"} />
      </Grid>
    </>
  );
};

export { Left };

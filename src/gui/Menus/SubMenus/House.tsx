import React from "react";
import { Button, Grid, IconButton, Menu, MenuItem } from "@mui/material";
import BathtubOutlinedIcon from "@mui/icons-material/BathtubOutlined";
import BedroomParentOutlinedIcon from "@mui/icons-material/BedroomParentOutlined";
import HvacOutlinedIcon from "@mui/icons-material/HvacOutlined";
import OtherHousesOutlinedIcon from "@mui/icons-material/OtherHousesOutlined";
import { useSceneContext } from "../../System/PiperContext";

const House = () => {
  const { app } = useSceneContext();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton onClick={handleClick} sx={{ marginTop: 1 }}>
        <OtherHousesOutlinedIcon fontSize={"large"} />
      </IconButton>

      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        <MenuItem
          onClick={() => {
            handleClose();

            if (!app) return;

            app.sceneController.setDrawMode("wall");
            app.sceneController.activeController = app.wallController;
          }}
        >
          Wall
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleClose();

            if (!app) return;
            // app?.sceneController.setDrawMode("d");
            // app.sceneController.activeController = app.wallController;
          }}
        >
          Door
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleClose();
            app?.sceneController.setDrawMode("object");
          }}
        >
          Window
        </MenuItem>
      </Menu>
    </>
  );
};

export { House };

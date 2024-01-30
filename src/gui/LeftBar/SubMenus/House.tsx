import React from "react";
import { Button, Grid, IconButton, Menu, MenuItem } from "@mui/material";
import OtherHousesOutlinedIcon from "@mui/icons-material/OtherHousesOutlined";
import { useSceneContext } from "../../System/PiperContext";
import { Wall, Door } from "../../../app/view";
import { Door as DoorModel } from "../../../app/model";

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

            if (!app?.sceneController.view) return;

            app.sceneController.view.mode = "draw";
            app.sceneController.view.active = {
              click: (position) => {
                app.wallController.create(position);
              },
              move: (position) => {
                let active = app.wallController.update(position);
                active?.notifyObservers();
              },
              reset: () => {
                app.wallController.reset();
              },
            };
          }}
        >
          Wall
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleClose();

            if (!app?.sceneController.view) return;

            app.sceneController.view.mode = "draw";

            let active: Door | null = new Door(new DoorModel(), app);
            app.sceneController.view.engine.scene.add(active.render());

            app.sceneController.view.active = {
              click: (position) => {
                if (active) {
                  app.sceneController.model.removeObject(active.uuid);
                  app.sceneController.model.addObject(active.model.clone());

                  if (active.mesh) {
                    console.log("active.mesh", active.mesh);
                    app.sceneController.view?.engine?.scene.add(
                      active.mesh.clone()
                    );
                  }

                  active.destroy();
                  active = null;
                }

                active = new Door(new DoorModel(), app);
                app.sceneController.model.addObject(active.model);
                app.sceneController.view?.engine?.scene.add(active.render());
              },
              move: (position) => {
                active?.update({ position: { ...position } });
                active?.reRender();
              },
              reset: () => {
                if (active) {
                  app.sceneController.model.removeObject(active.uuid);
                }

                active = null;
              },
            };
          }}
        >
          Door
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleClose();
            if (!app?.sceneController.view) return;

            app.sceneController.view.mode = "draw";
          }}
        >
          Window
        </MenuItem>
      </Menu>
    </>
  );
};

export { House };

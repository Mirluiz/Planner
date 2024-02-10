import React, { FC, memo, useEffect, useState } from "react";
import { Backdrop, CircularProgress, Grid } from "@mui/material";

const BackDrop: FC<{ open: boolean }> = ({ open }) => {
  return (
    <Backdrop
      sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
      open={open}
    >
      <CircularProgress color="inherit" />
    </Backdrop>
  );
};

export default memo(BackDrop);

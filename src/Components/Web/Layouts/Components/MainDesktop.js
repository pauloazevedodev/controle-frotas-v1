import { Box, CssBaseline, Divider, Toolbar } from "@mui/material";
import React from "react";
import ToolbarCustom from "./ToolbarCustom";
import MenuList from "../MenuList";
import Drawer from "@mui/material/Drawer";
import AppBar from "@mui/material/AppBar";
import ControleFrotas from "../../Pages/ControleFrotas/ControleFrotas";

const MainDesktop = ({ children, setIsAuthenticated }) => {
  return (
    <Box sx={{ display: "flex", backgroundColor: "#222b45" }}>
      <CssBaseline />
      <AppBar
        sx={{
          backgroundColor: "#222b45",
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
      >
        <ToolbarCustom setIsAuthenticated={setIsAuthenticated} />
      </AppBar>
      <Drawer variant="permanent" sx={{ borderColor: "#222b45" }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            height: "100vh",
            backgroundColor: "#222b45",
            width: 250,
          }}
        >
          <Box>
            <Toolbar />
            <MenuList />
            <Divider />
          </Box>
        </Box>
      </Drawer>
      <Box
        component="main"
        sx={{
          backgroundColor: "#222b45",
          flexGrow: 1,
          height: "91.6vh",
          overflow: "auto",
          mt: 10,
          ml: 32,
          p: 2,
        }}
      >
        {children}
        <Toolbar />
      </Box>
    </Box>
  );
};

export default MainDesktop;

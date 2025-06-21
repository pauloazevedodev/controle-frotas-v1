import Box from "@mui/material/Box";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import AirportShuttleIcon from "@mui/icons-material/AirportShuttle";
import GroupIcon from "@mui/icons-material/Group";
import { NavLink } from "react-router-dom";
import { Divider, Tooltip, Typography } from "@mui/material";
import { isMobileOnly } from "react-device-detect";
import { React, useState } from "react";

const MenuList = ({ setOpenModal, setOpenDrawer }) => {
  return (
    <>
      <Box sx={{ mt: 1 }}>
        <Tooltip
          title={
            <Typography sx={{ fontSize: "1rem" }}>
              Controle de Frotas
            </Typography>
          }
          arrow
          placement="right"
        >
          <NavLink to="/veiculos" key="frotas" sx={{ color: "white" }}>
            <ListItem button>
              <ListItemIcon>
                <AirportShuttleIcon sx={{ color: "white" }} />
              </ListItemIcon>
              <ListItemText
                primary="Controle de Frotas"
                sx={{ color: "white" }}
              />
            </ListItem>
          </NavLink>
        </Tooltip>
      </Box>
      <Divider />
      <Box sx={{ mt: 1 }}>
        <Tooltip
          title={<Typography sx={{ fontSize: "1rem" }}>Usuários</Typography>}
          arrow
          placement="right"
        >
          <NavLink to="/usuarios" key="frotas" sx={{ color: "white" }}>
            <ListItem button>
              <ListItemIcon>
                <GroupIcon sx={{ color: "white" }} />
              </ListItemIcon>
              <ListItemText primary="Usuários" sx={{ color: "white" }} />
            </ListItem>
          </NavLink>
        </Tooltip>
      </Box>
    </>
  );
};

export default MenuList;

// OK

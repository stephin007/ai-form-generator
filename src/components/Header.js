import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Badge,
  Chip,
} from "@mui/material";
import { useAuth } from "../../AuthContext";
import LoginButton from "./LoginButton";
import ProfileMenu from "./ProfileMenu";

import { getUserApiCallCount } from "../../firebaseConfig";
import { useState, useEffect } from "react";

const Header = ({ apiCallCount }) => {
  const { user } = useAuth();

  return (
    <AppBar position="fixed">
      <Toolbar>
        <img
          src="https://firebasestorage.googleapis.com/v0/b/cristomathewmemorial.appspot.com/o/2.png?alt=media&token=dc7379e4-488e-447e-9644-aef33cc8cccd"
          alt="Logo"
          style={{ height: "60px" }}
        />
        <Typography variant="h6" style={{ flexGrow: 1 }}>
          Formify AI
        </Typography>
        {user ? (
          <>
            <IconButton color="inherit">
              <Badge badgeContent={`${5 - apiCallCount}/5`} color="secondary">
                <Chip label="Free Attempts Left" sx={{ color: "white" }} />
              </Badge>
            </IconButton>
            <ProfileMenu />
          </>
        ) : (
          <LoginButton />
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;

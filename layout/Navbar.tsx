import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Link,
  Button,
} from "@mui/material";
import { Menu as MenuIcon, ArrowForward } from "@mui/icons-material";
import React from "react";
import UserMenu from "~/components/UserMenu";
import NextLink from "next/link";
import { useDateNav } from "~/hooks/useDateNav";
import { useAuthCtx } from "~/contexts/AuthCtx";

interface NavbarI {
  open: boolean;
  handleDrawerOpen: () => void;
}
const Navbar: React.FC<NavbarI> = ({ open, handleDrawerOpen }) => {
  const { goToToday, thisIsToday } = useDateNav();
  const { user, user_id } = useAuthCtx();
  return (
    <AppBar position="fixed">
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Box display="flex" alignItems="center">
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{ mr: 2, ...(open && { display: "none" }) }}
          >
            <MenuIcon />
          </IconButton>
          <NextLink href={user_id ? "/profile" : "/"}>
            <Button color="inherit">Gratitude Journal</Button>
          </NextLink>
        </Box>
        {!!user && (
          <Box display="flex" alignItems="center">
            <NextLink href="/tags">
              <Button size="small" color="inherit" variant="text">
                Tags
              </Button>
            </NextLink>
            {!thisIsToday && (
              <Button
                onClick={goToToday}
                endIcon={<ArrowForward />}
                size="small"
                color="inherit"
                variant="outlined"
              >
                Today
              </Button>
            )}
            <UserMenu />
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;

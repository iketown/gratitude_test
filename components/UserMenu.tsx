import { AccountCircle } from "@mui/icons-material";
import { IconButton, Menu, MenuItem } from "@mui/material";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useAuthCtx } from "~/contexts/AuthCtx";
import NextLink from "next/link";

//
//
const UserMenu = () => {
  const { user, logOut } = useAuthCtx();
  const { push } = useRouter();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  useEffect(() => {
    setAnchorEl(null);
  }, []);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleLogOut = async () => {
    await logOut();
    push("/");
  };
  const handleMyAccount = () => {
    console.log("user", user);
    handleClose();
  };

  return (
    <div>
      {!!user && (
        <div>
          <IconButton
            size="large"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleMenu}
            color="inherit"
          >
            <AccountCircle />
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            keepMounted
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <NextLink href="/profile">
              <MenuItem onClick={handleClose}>Profile</MenuItem>
            </NextLink>
            <MenuItem onClick={handleMyAccount}>My account</MenuItem>
            <MenuItem onClick={handleLogOut}>Sign Out</MenuItem>
          </Menu>
        </div>
      )}
    </div>
  );
};

export default UserMenu;

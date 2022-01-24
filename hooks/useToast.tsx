import { useSnackbar } from "notistack";
import { Close } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import React from "react";

type SnackVariant = "success" | "warning" | "error" | "info" | "default";

export const useToast = () => {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const toast = (
    message: string,
    variant: SnackVariant = "default",
    otherAction?: React.ReactNode
  ) => {
    enqueueSnackbar(message, {
      variant,
      action: (key) => (
        <>
          <IconButton onClick={() => closeSnackbar(key)}>
            <Close />
          </IconButton>
          {otherAction}
        </>
      ),
    });
  };
  return { toast };
};

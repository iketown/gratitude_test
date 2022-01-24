import React, { useState } from "react";
import type { FC } from "react";
import {
  Dialog,
  DialogTitle,
  DialogActions,
  Button,
  Grid,
  Box,
  Typography,
  Slider,
  DialogContent,
  Tabs,
  Tab,
  Tooltip,
} from "@mui/material";
import { icons, colors } from "~/utils/tagIcons";
import { motion } from "framer-motion";
import { FaSave, FaTimesCircle } from "react-icons/fa";
import { IconType } from "react-icons";
import ColorDialogContent from "./ColorDialogContent";
import IconEmojiDialogContent from "./IconEmojiDialogContent";
import { getTagIcon } from "./tagsPageHelpers";
import { grey } from "@mui/material/colors";
const MotionGridItem = motion(Grid);

interface ColorDialogI {
  open: boolean;
  handleClose: (newTag?: Tag) => void;
  tag: Tag;
  isNew?: boolean;
}

const depthMap = {
  0: "A100",
  25: "A200",
  50: "A400",
  75: "A700",
  100: 900,
};

const TagIconDialog: FC<ColorDialogI> = ({ open, handleClose, tag }) => {
  const [colorHex, setColorHex] = useState(
    (tag.type === "icon_tag" && tag.color) || grey[300]
  );
  const [tab, setTab] = useState<"icon" | "color">("icon");
  const [chosenTag, setChosenTag] = useState<Tag>(tag);

  const handleSave = async () => {
    const newTag: Tag =
      chosenTag.type === "emoji_tag"
        ? chosenTag // no color for emojis :/
        : { ...chosenTag, color: colorHex };
    handleClose(newTag);
  };

  const Icon = getTagIcon(chosenTag);
  return (
    <Dialog onClose={() => handleClose()} open={open} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ textAlign: "center", p: 3 }}>
        <Typography variant="subtitle1" fontWeight={"bold"}>
          {tag.tagTitle}
        </Typography>
        {Icon && (
          <Icon
            style={{ height: 60, width: 60, color: colorHex, fontSize: 60 }}
          />
        )}
        <Tabs
          centered
          value={tab}
          onChange={(e, val) => {
            setTab(val);
          }}
        >
          <Tab
            label="Color"
            value="color"
            disabled={chosenTag.type === "emoji_tag"}
          />
          <Tab label="Icon" value="icon" />
        </Tabs>
      </DialogTitle>
      <DialogContent
        sx={{ justifyContent: "center", display: "flex", alignItems: "center" }}
      >
        {tab === "color" && (
          <ColorDialogContent {...{ colorHex, setColorHex }} />
        )}
        {tab === "icon" && (
          <IconEmojiDialogContent
            setChosenTag={setChosenTag}
            currentTag={tag}
            currentColor={colorHex}
          />
        )}
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={() => handleClose()}>
          Cancel
        </Button>
        <Button variant="contained" startIcon={<FaSave />} onClick={handleSave}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TagIconDialog;

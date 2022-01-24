import React, { useState } from "react";
import type { Dispatch, SetStateAction, FC } from "react";
import { icons } from "~/utils/tagIcons";
import type { IconLibrary } from "~/utils/tagIcons";
import { Grid, Box, Typography, Container, Divider } from "@mui/material";
import { grey } from "@mui/material/colors";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { nanoid } from "nanoid";
import type { IEmojiData } from "emoji-picker-react";

const iconStyle = { width: 30, height: 30, color: grey.A700 };

const Picker = dynamic(() => import("emoji-picker-react"), { ssr: false });
const MotionGridItem = motion(Grid);

interface IEDCi {
  setChosenTag: Dispatch<SetStateAction<Tag>>;
  currentTag: Tag;
  currentColor: string;
}
const IconEmojiDialogContent: FC<IEDCi> = ({
  setChosenTag,
  currentTag,
  currentColor,
}) => {
  // const [chosenEmo, setChosenEmo] = useState<IEmojiData>(null);

  const onEmojiClick = (
    event: React.MouseEvent<Element, MouseEvent>,
    emojiObject: IEmojiData
  ) => {
    // setChosenEmo(emojiObject);
    const emojiTag: EmojiTag = {
      type: "emoji_tag",
      tag_id: currentTag.tag_id,
      emoji: emojiObject.emoji,
      tagTitle: currentTag.tagTitle,
    };
    setChosenTag(emojiTag);
  };
  const onIconClick = (iconName: string) => {
    const iconTag: IconTag = {
      type: "icon_tag",
      tag_id: currentTag.tag_id,
      tagTitle: currentTag.tagTitle,
      iconName,
      color: currentColor,
    };
    setChosenTag(iconTag);
  };
  return (
    <Grid container spacing={2}>
      {Object.entries(icons).map(([name, Icon]) => {
        return (
          <MotionGridItem
            whileHover={{ scale: 1.1 }}
            sx={{ cursor: "pointer" }}
            justifyItems={"center"}
            display="flex"
            flexDirection={"column"}
            alignItems={"center"}
            item
            m={2}
            key={name}
            onClick={() => {
              onIconClick(name);
            }}
          >
            <Box>
              <Icon style={iconStyle} />
            </Box>
          </MotionGridItem>
        );
      })}
      <Grid item xs={12}>
        <Divider>
          <Typography variant="overline">emojis</Typography>
        </Divider>
      </Grid>
      <Grid item xs={12}>
        {/* <pre>{chosenEmo && JSON.stringify(chosenEmo)}</pre> */}
        <div>
          {/* {chosenEmo ? (
            <span style={{ fontSize: iconStyle.width }}>{chosenEmo.emoji}</span>
          ) : (
            <span>No emoji Chosen</span>
          )} */}
          <Picker pickerStyle={{ width: "100%" }} onEmojiClick={onEmojiClick} />
        </div>
      </Grid>
    </Grid>
  );
};

export default IconEmojiDialogContent;

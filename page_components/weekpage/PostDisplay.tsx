import React, { useState } from "react";
import type { FC } from "react";
import { Typography, Button, Box, Tooltip } from "@mui/material";
import { useUserCtx } from "~/contexts/UserCtx";
import { getTagIcon } from "../tagspage/tagsPageHelpers";
import TagBox from "./TagBox";
import RemovePostWarningModal from "./RemovePostWarningModal";
import { format } from "date-fns";
interface PostDisplayI {
  post: Post;
  startEditing: () => void;
  selectedDate: Date;
}

const PostDisplay: React.FC<PostDisplayI> = ({
  post,
  startEditing,
  selectedDate,
}) => {
  const { comment, tags } = post;
  const [warningOpen, setWarningOpen] = useState(false);
  return (
    <Box sx={{ mx: { xs: 1, sm: 2 } }}>
      <Box position={"relative"}>
        <Box
          display="flex"
          justifyContent={"space-between"}
          alignItems={"flex-end"}
        >
          <Typography variant="subtitle1" color="GrayText">
            {format(selectedDate, "eeee").toUpperCase()}
          </Typography>
          <Box display="flex" alignItems="flex-end">
            <Typography variant="subtitle1" sx={{ mr: 1 }} color="GrayText">
              {format(selectedDate, "MMMM").toUpperCase()}
            </Typography>
            <Typography variant="h4">{format(selectedDate, "d")}</Typography>
          </Box>
        </Box>
        <Box
          border={1}
          borderColor={"gainsboro"}
          p={3}
          minWidth={"20rem"}
          maxWidth={"70vw"}
          sx={{ background: (th) => th.palette.background.paper }}
        >
          <Typography component={"p"} variant="body2">
            {comment.split("\n").map((par, i) => (
              <Typography component="p" variant="body2" key={`${i}${par}`}>
                {par}
              </Typography>
            ))}
          </Typography>
          {tags && (
            <Box
              sx={{
                position: "absolute",
                bottom: "-25px",
                right: "5px",
                padding: 0,
                display: "flex",
                alignItems: "center",
              }}
            >
              <TagBox tag_ids={tags} />
            </Box>
          )}
        </Box>
      </Box>
      <Box mt={1}>
        <Button onClick={startEditing}>edit post</Button>
        <Button
          onClick={() => {
            setWarningOpen(true);
          }}
          color="warning"
        >
          Remove post
        </Button>
      </Box>
      <RemovePostWarningModal
        post={post}
        open={warningOpen}
        selectedDate={selectedDate}
        onClose={() => {
          setWarningOpen(false);
        }}
      />
    </Box>
  );
};

export default PostDisplay;

import React, { useState } from "react";
import {
  Box,
  TextField,
  Typography,
  Button,
  Hidden,
  Autocomplete,
  Divider,
  ListItem,
} from "@mui/material";
import { format } from "date-fns";
import { usePostCtx } from "~/contexts/PostCtx";
import { useToast } from "~/hooks/useToast";
import { useUserCtx } from "~/contexts/UserCtx";
import { defaultTagObj } from "~/utils/tagIcons";
import { isEqual } from "lodash";
import TagsAutoComplete from "./TagsAutoComplete";
import TagBox from "./TagBox";

interface CommentInputI {
  selectedDate: Date | null;
  stopEditing: () => void;
  post?: Post;
}
const CommentInput: React.FC<CommentInputI> = ({
  selectedDate,
  stopEditing,
  post,
}) => {
  if (!selectedDate) return null;
  const { updatePost } = usePostCtx();
  const { userInfo, tags } = useUserCtx();
  const { toast } = useToast();
  const [comment, setComment] = useState(post?.comment || "");
  const [selectedTags, setSelectedTags] = useState<Tag[]>(
    post?.tags?.map((tag_id) => tags?.tags[tag_id] || {}) || []
  );
  const date_id = format(selectedDate, "yyyy-MM-dd");

  const handleSave = async () => {
    const newTags = selectedTags.map((t) => t.tag_id);
    const oldTags = post?.tags || [];
    const tagsToRemove = oldTags.filter((t) => !newTags.includes(t));
    const tagsToAdd = newTags.filter((t) => !oldTags.includes(t));
    await updatePost(
      {
        date_id,
        comment: comment.trim(),
        tags: selectedTags.map((t) => t.tag_id),
      },
      tagsToAdd,
      tagsToRemove
    );
    stopEditing();
    toast(`${format(selectedDate, "MMM d")} updated`, "success");
  };

  const dateLine = (
    <Box display="flex" justifyContent={"center"} mb={-0.5}>
      <Typography variant="overline">
        New Post for{" "}
        <span style={{ textDecoration: "underline" }}>
          {format(selectedDate, "eeee, MMM d")}
        </span>
      </Typography>
    </Box>
  );
  return (
    <div style={{ width: "100%" }}>
      <Box>{dateLine}</Box>
      <TextField
        sx={{ backgroundColor: (th) => th.palette.background.paper }}
        fullWidth
        multiline
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />
      <Box
        display="flex"
        justifyContent={"space-between"}
        alignItems="center"
        mt={1}
      >
        <Button onClick={stopEditing} variant="outlined" size="small">
          Cancel
        </Button>
        <Box
          sx={{
            flexGrow: 1,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Box sx={{ position: "relative" }}>
            <TagBox tag_ids={selectedTags.map((tag) => tag?.tag_id)} />
          </Box>
        </Box>
        <Button
          variant="contained"
          size="small"
          onClick={handleSave}
          disabled={
            !comment?.length ||
            (isEqual(comment?.trim(), post?.comment?.trim()) &&
              isEqual(
                post?.tags,
                selectedTags.map(({ tag_id }) => tag_id)
              ))
          }
        >
          Save
        </Button>
      </Box>
      <TagsAutoComplete {...{ selectedTags, setSelectedTags, selectedDate }} />
    </div>
  );
};

export default CommentInput;

import {
  Box,
  IconButton,
  ListItem,
  ListItemText,
  TextField,
} from "@mui/material";
import React, { useState } from "react";
import { Draggable } from "react-beautiful-dnd";
import { FaEdit, FaSave, FaTimesCircle } from "react-icons/fa";
import { RiArrowUpDownLine } from "react-icons/ri";
import { useTagFxns } from "~/hooks/useTagFxns";
import TagIconDialog from "./TagIconDialog";
import { getTagIcon } from "./tagsPageHelpers";

interface TagListItemI {
  tag: Tag;
  index: number;
}

const TagListItem: React.FC<TagListItemI> = ({ tag, index }) => {
  const [editingText, setEditingText] = useState(false);
  const [editingIcon, setEditingIcon] = useState(false);
  const { updateTag, removeTag } = useTagFxns();
  const [title, setTitle] = useState(tag.tagTitle);

  const handleCancelTitle = () => {
    setTitle(tag.tagTitle);
    setEditingText(false);
  };

  const handleSaveTitle = (tagTitle: string) => {
    updateTag({ ...tag, tagTitle });
    setTitle(tagTitle);
    setEditingText(false);
  };

  const Icon = getTagIcon(tag);
  const editingTextView = (
    <TagTitleEditor
      onCancel={handleCancelTitle}
      onDone={handleSaveTitle}
      defaultValue={tag.tagTitle}
    />
  );

  const normalView = (
    <>
      <IconButton
        onClick={() => {
          setEditingIcon(true);
        }}
        sx={{ mr: 1 }}
        size="small"
      >
        <Icon
          style={{
            height: 30,
            width: 30,
            color: (tag.type === "icon_tag" && tag.color) || "",
          }}
        />
      </IconButton>
      <IconButton
        onClick={() => {
          setEditingText(true);
        }}
        size="small"
        sx={{ mr: 1 }}
      >
        <FaEdit />
      </IconButton>
      <ListItemText primary={title} sx={{ mr: 4, maxWidth: "10rem" }} />
      <IconButton
        size="small"
        color="default"
        onClick={() => {
          removeTag(tag.tag_id);
        }}
      >
        <FaTimesCircle />
      </IconButton>
    </>
  );
  return (
    <>
      <Draggable draggableId={tag.tag_id} index={index}>
        {({ innerRef, draggableProps, dragHandleProps }) => {
          return (
            <div key={tag.tag_id} ref={innerRef} {...draggableProps}>
              <ListItem divider>
                {editingText ? editingTextView : normalView}
                <Box sx={{ ml: 2, pr: 0 }}>
                  <IconButton {...dragHandleProps}>
                    <RiArrowUpDownLine size="1rem" />
                  </IconButton>
                </Box>
              </ListItem>
            </div>
          );
        }}
      </Draggable>
      <TagIconDialog
        open={editingIcon}
        handleClose={async (newTag) => {
          if (newTag) {
            await updateTag(newTag);
          }
          setEditingIcon(false);
        }}
        tag={tag}
      />
    </>
  );
};

export default TagListItem;

interface TagTitleEditorI {
  onDone: (newText: string) => void;
  onCancel: () => void;
  defaultValue: string;
}
export const TagTitleEditor: React.FC<TagTitleEditorI> = ({
  onDone,
  onCancel,
  defaultValue,
}) => {
  const [title, setTitle] = useState(defaultValue);

  const handleCancelTitle = () => {
    setTitle(defaultValue);
    onCancel();
  };

  const handleSaveTitle = () => {
    onDone(title);
  };

  return (
    <>
      <TextField
        onKeyDown={(e) => {
          if (e.key === "Escape") handleCancelTitle();
        }}
        autoFocus
        fullWidth
        value={title}
        onChange={(e) => {
          setTitle(e.target.value);
        }}
      />
      <IconButton onClick={handleCancelTitle} size="small" color="error">
        <FaTimesCircle />
      </IconButton>
      <IconButton onClick={handleSaveTitle} size="small" color="primary">
        <FaSave />
      </IconButton>
    </>
  );
};

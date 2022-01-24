import { AddCircle } from "@mui/icons-material";
import { IconButton, ListItemButton, ListItemText } from "@mui/material";
import { nanoid } from "nanoid";
import React, { useState } from "react";
import { useTagFxns } from "~/hooks/useTagFxns";
import TagIconDialog from "./TagIconDialog";
import { TagTitleEditor } from "./TagListItem";

interface AddTagListItemI {
  tag_ids: string[];
}
const TagListItemAdder: React.FC<AddTagListItemI> = ({ tag_ids }) => {
  const [editing, setEditing] = useState(false);
  const [iconOpen, setIconOpen] = useState(false);
  const [newTag, setNewTag] = useState<IconTag>();
  const { addNewTag } = useTagFxns();
  const handleNewText = (tagTitle: string) => {
    const defaultTag: IconTag = {
      type: "icon_tag",
      iconName: "other",
      tag_id: `tag_${nanoid(8)}`,
      color: "grey",
      tagTitle: tagTitle,
    };
    setEditing(false);
    setNewTag(defaultTag);
    setIconOpen(true);
  };
  const idleView = (
    <>
      <ListItemText primary="Add New Tag" />
      <IconButton color="info">
        <AddCircle />
      </IconButton>
    </>
  );
  const editingView = (
    <TagTitleEditor
      defaultValue=""
      onCancel={() => setEditing(false)}
      onDone={handleNewText}
    />
  );
  return (
    <>
      <ListItemButton onClick={() => !editing && setEditing(true)}>
        {editing ? editingView : idleView}
      </ListItemButton>
      {newTag && (
        <TagIconDialog
          isNew
          open={iconOpen}
          handleClose={async (newTag) => {
            if (newTag) {
              // reset
              await addNewTag(newTag, tag_ids);
              setNewTag(undefined);
            }
            setIconOpen(false);
          }}
          tag={newTag}
        />
      )}
    </>
  );
};

export default TagListItemAdder;

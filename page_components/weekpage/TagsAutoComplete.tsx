import { Box, ListItem, ListItemButton, TextField } from "@mui/material";
import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete";
import { format } from "date-fns";
import { nanoid } from "nanoid";
import type { Dispatch, FC, SetStateAction } from "react";
import React, { useEffect, useState, memo } from "react";
import { useTagCtx } from "~/contexts/TagCtx";
import { useTagFxns } from "~/hooks/useTagFxns";
import TagIconDialog from "~/page_components/tagspage/TagIconDialog";
import { getTagIcon } from "~/page_components/tagspage/tagsPageHelpers";

interface TagsAutoCompleteI {
  selectedTags: Tag[];
  setSelectedTags: Dispatch<SetStateAction<Tag[]>>;
  selectedDate: Date;
}

const filter = createFilterOptions<Tag>();

const TagsAutoComplete: FC<TagsAutoCompleteI> = ({
  selectedTags,
  setSelectedTags,
  selectedDate,
}) => {
  const [tagIconOpen, setTagIconOpen] = useState(false);
  const [newTagTitle, setNewTagTitle] = useState("");
  const { addNewTag } = useTagFxns();
  const { myTags, tag_ids } = useTagCtx();

  const options =
    tag_ids?.map((id) => (myTags && myTags[id] ? myTags[id] : null)) || [];
  console.log("render tagsautocomplete", options);

  useEffect(() => {
    const newTagNames = selectedTags.filter((t) => t.isNew);
    if (newTagNames.length) {
      console.log({ newTagNames });
      setNewTagTitle(newTagNames[0].tagTitle);
      setTagIconOpen(true);
    }
  }, [selectedTags, myTags]);

  return (
    <div>
      <TagIconDialog
        tag={{
          tagTitle: newTagTitle,
          tag_id: `tag_search${nanoid(8)}`,
          type: "icon_tag",
          iconName: "other",
          color: "lightgray",
        }}
        open={tagIconOpen}
        handleClose={async (newTag) => {
          if (newTag) {
            await addNewTag(newTag, tag_ids);
            setSelectedTags((old) => {
              const prevArray = [...old].filter(
                (t) => t.tagTitle !== newTagTitle
              );
              return [...prevArray, newTag];
            });
          } else {
            setSelectedTags((old) =>
              [...old].filter((t) => t.tagTitle !== newTagTitle)
            );
          }
          setNewTagTitle("");
          setTagIconOpen(false);
        }}
      />
      <Autocomplete
        sx={{
          backgroundColor: (theme) => theme.palette.background.paper,
          mt: 2,
        }}
        isOptionEqualToValue={(opt, val) => opt.tagTitle === val.tagTitle}
        selectOnFocus
        clearOnBlur
        handleHomeEndKeys
        value={selectedTags}
        size="small"
        onChange={(e, newTags) => setSelectedTags(newTags)}
        multiple
        id="tags-standard"
        //@ts-ignore
        options={options?.filter((o) => !!o) || []}
        getOptionLabel={(tag: Tag) => tag?.tagTitle || ""}
        //
        filterOptions={(options, params) => {
          const filtered = filter(options, params);

          const { inputValue } = params;
          // Suggest the creation of a new value
          const isExisting = options.some(
            (option) => inputValue === option?.tagTitle
          );
          if (inputValue !== "" && !isExisting) {
            filtered.push({
              tagTitle: inputValue,
              tag_id: "newtag",
              type: "icon_tag",
              color: "grey",
              iconName: "other",
              isNew: true,
            });
          }

          return filtered;
        }}
        //
        renderOption={(params) => {
          //@ts-ignore
          const key = params.key;
          const tag = options.find((o) => o?.tagTitle === key);
          if (!tag) {
            return (
              //@ts-ignore
              <ListItemButton
                {...params}
                onClick={(e) => {
                  setNewTagTitle(key);
                  setTagIconOpen(true);
                }}
              >
                <div>create new tag for {key}</div>
              </ListItemButton>
            );
          }
          const Icon = getTagIcon(tag);
          return (
            <ListItem {...params}>
              <Box
                sx={{
                  mr: 2,
                  color: (tag.type === "icon_tag" && tag.color) || "",
                }}
              >
                <Icon />
              </Box>
              {tag.tagTitle}
            </ListItem>
          );
        }}
        renderInput={(params) => {
          return (
            <TextField
              {...params}
              variant="standard"
              label={`Tags for ${format(selectedDate, "MMM d")}`}
              placeholder={"add tags here"}
            />
          );
        }}
      />
      {/* <pre style={{ fontSize: "10px" }}>{JSON.stringify(tags, null, 2)}</pre> */}
    </div>
  );
};

export default memo(TagsAutoComplete);

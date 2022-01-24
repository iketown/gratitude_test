import { Box, Tooltip, CircularProgress } from "@mui/material";
import React from "react";
import type { FC } from "react";
import { useUserCtx } from "~/contexts/UserCtx";
import { getTagIcon } from "../tagspage/tagsPageHelpers";

interface TagBoxI {
  tag_ids: string[];
}
export const TagBox: FC<TagBoxI> = ({ tag_ids }) => {
  const { tags: tagDoc } = useUserCtx();
  const { tags } = tagDoc;
  return (
    <Box
      sx={{
        // bgcolor: "background.paper",
        padding: 0,
        display: "flex",
        alignItems: "center",
      }}
    >
      {tag_ids.map((tag_id) => {
        const tag = tags && tags[tag_id];
        if (!tag) return <CircularProgress size={25} />;
        const Icon = getTagIcon(tag);
        return (
          <Tooltip title={tag.tagTitle}>
            <Box ml={1}>
              <Icon
                style={{
                  color: (tag.type === "icon_tag" && tag.color) || "",
                  height: 25,
                  width: 25,
                  fontSize: 25,
                }}
              />
            </Box>
          </Tooltip>
        );
      })}
      {/* <pre style={{ fontSize: 12 }}>{JSON.stringify(tags, null, 2)}</pre> */}
    </Box>
  );
};

export default TagBox;

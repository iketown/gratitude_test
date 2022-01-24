import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  CardContent,
  LinearProgress,
  List,
  ListItemButton,
  ListItemText,
  Typography,
} from "@mui/material";
import { grey } from "@mui/material/colors";
import React, { useMemo, useState } from "react";
import { useTagCtx } from "~/contexts/TagCtx";
import { useDateNav } from "~/hooks/useDateNav";
import { format } from "date-fns";

import { getTagIcon } from "./tagsPageHelpers";

const TagUsage = () => {
  const { tagUseDoc, myTags } = useTagCtx();
  const [openTagId, setOpenTagId] = useState("");

  const { goToDateId } = useDateNav();

  const usageWithStats = useMemo(
    () =>
      Object.entries(tagUseDoc)
        .map(([tag_id, obj]) => {
          const uses = Object.entries(obj)
            .filter(([doc_id, o]) => !!o)
            .map(([post_id]) => post_id)
            .sort((a, b) => (a < b ? 1 : -1)); // most recent posts first
          return { ...obj, tag_id, uses };
        })
        .filter(({ uses }) => uses.length)
        .map(({ tag_id, uses }) => ({ tag_id, uses }))
        .sort((a, b) => b.uses.length - a.uses.length),
    [tagUseDoc]
  );
  if (!usageWithStats?.length)
    return (
      <CardContent>
        <Typography variant="subtitle1">no tags used</Typography>
      </CardContent>
    );
  return (
    <Box sx={{ minWidth: 400 }}>
      <List sx={{ bgcolor: grey[100] }}>
        {usageWithStats.map(({ tag_id, uses }) => {
          const tag = myTags && myTags[tag_id];
          if (!tag)
            return (
              <li>
                <LinearProgress />
                SEARCHING for {tag_id}
              </li>
            );
          const Icon = getTagIcon(tag);
          return (
            <Accordion
              expanded={openTagId === tag_id}
              key={tag_id}
              onChange={(e, exp) =>
                exp ? setOpenTagId(tag_id) : setOpenTagId("")
              }
            >
              <AccordionSummary
                sx={{ alignItems: "center", display: "flex" }}
                expandIcon={<ExpandMoreIcon />}
              >
                <Icon
                  style={{
                    width: 25,
                    height: 25,
                    fontSize: 25,
                    color: (tag.type === "icon_tag" && tag.color) || "",
                    marginRight: "1rem",
                  }}
                />
                <ListItemText
                  primary={tag.tagTitle}
                  //   secondary={`${uses.length} post${uses.length > 1 ? "s" : ""}`}
                ></ListItemText>
                <Typography variant="caption" color="GrayText">{`${
                  uses.length
                } post${uses.length > 1 ? "s" : ""}`}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <List>
                  {uses.map((use) => {
                    const date = new Date(`${use}T00:00`);
                    return (
                      <ListItemButton onClick={() => goToDateId(use)} key={use}>
                        {format(date, "MMM d yyyy")}
                      </ListItemButton>
                    );
                  })}
                </List>
              </AccordionDetails>
            </Accordion>
          );
        })}
      </List>
      {/* <Divider></Divider> */}
      {/* <pre style={{ fontSize: 12 }}>
        {JSON.stringify(usageWithStats, null, 2)}
      </pre> */}
    </Box>
  );
};

export default TagUsage;

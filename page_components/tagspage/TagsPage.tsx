import {
  Box,
  Button,
  Container,
  List,
  Typography,
  Card,
  Tabs,
  Tab,
} from "@mui/material";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import type { OnDragEndResponder } from "react-beautiful-dnd";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import { useAuthCtx } from "~/contexts/AuthCtx";
import { useUserCtx } from "~/contexts/UserCtx";
import { useTagFxns } from "~/hooks/useTagFxns";
import { db } from "~/utils/firebase";
import { defaultTagObj } from "~/utils/tagIcons";
import TagListItem from "./TagListItem";
import TagListItemAdder from "./TagListItemAdder";
import { reorder } from "./tagsPageHelpers";
import { AnimatePresence, motion } from "framer-motion";
import TagUsage from "./TagUsage";
import { useTagCtx } from "~/contexts/TagCtx";

// const Picker = dynamic(() => import("emoji-picker-react"), { ssr: false });
// const style = { width: 60, height: 60 };

const default_tag_ids = Object.keys(defaultTagObj);

interface TagsIndexI {
  myTagset: TagDoc | false;
}

const MoCard = motion(Card);

export const TagsIndex: React.FC<TagsIndexI> = ({ myTagset }) => {
  const { user_id } = useAuthCtx();
  const { userInfo } = useUserCtx();
  const { push } = useRouter();
  const {
    setListenToTagUse,
    setMyTags,
    setTagIds,
    myTags = myTagset && myTagset.tags,
    tag_ids = myTagset && myTagset.tag_ids, // first render will already have the SSR versions.
  } = useTagCtx();
  const { updateTagOrder, removeTag } = useTagFxns();
  const [tabValue, setTabValue] = useState<"list" | "usage">("list");

  const handleChangeTab = (e: any, val: "list" | "usage") => {
    if (val === "usage") setListenToTagUse(true); // dont fetch those unless they're being viewed
    setTabValue(val);
  };

  useEffect(() => {
    if (!myTagset) return;
    setMyTags(myTagset.tags);
    setTagIds(myTagset.tag_ids);
  }, [myTagset]);

  useEffect(() => {
    // listen to custom tag changes after load.  first version comes from SSR
    if (!user_id || !userInfo?.hasCustomTags) {
      return;
    }
    const loadTime = new Date().valueOf();
    console.log("listening to changes after", loadTime);
    const q = query(
      collection(db, "users", user_id, "tags"),
      where("updated_at", ">", loadTime)
    );
    const unsub = onSnapshot(q, (snap) => {
      snap.docChanges().forEach(({ doc }) => {
        if (doc.id === "my_tagset") {
          console.log("change detected", doc.data());
          const { tag_ids, tags } = doc.data() as TagDoc;
          setMyTags(tags);
          setTagIds(tag_ids);
        }
      });
    });
    return unsub;
  }, [user_id, userInfo?.hasCustomTags]);

  const onDragEnd: OnDragEndResponder = ({
    draggableId,
    source,
    destination,
    type,
  }) => {
    if (!destination) return;
    if (!tag_ids) return;
    const _newList = reorder(tag_ids, source.index, destination.index);
    setTagIds(_newList);
    updateTagOrder(_newList);
    // update fb with new tag_ids
  };

  return !process.browser ? null : (
    <DragDropContext {...{ onDragEnd }}>
      <Container>
        <Tabs centered value={tabValue} onChange={handleChangeTab}>
          <Tab label="List" value="list" />
          <Tab label="Usage" value="usage" />
        </Tabs>
        <AnimatePresence>
          <Box
            sx={{
              position: "relative",
              width: "100%",
              display: "flex",
              justifyContent: "center",
              pt: 5,
            }}
          >
            {tabValue === "list" && (
              <MoCard
                sx={{ maxWidth: 500 }}
                key="listCard"
                initial={{ x: "-50%", opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: "-50%", opacity: 0 }}
              >
                <Droppable droppableId="tag_list">
                  {({ droppableProps, innerRef, placeholder }) => {
                    return (
                      <List dense ref={innerRef} {...droppableProps}>
                        <TagListItemAdder tag_ids={tag_ids || []} />
                        {tag_ids &&
                          tag_ids.map((tag_id, index) => {
                            const tag = myTags && myTags[tag_id];
                            if (!tag) {
                              console.log("no tag at", tag_id);
                              return <div>no tag here</div>;
                            }

                            return (
                              <TagListItem
                                key={tag_id}
                                tag={tag}
                                index={index}
                              />
                            );
                          })}
                        {placeholder}
                      </List>
                    );
                  }}
                </Droppable>
              </MoCard>
            )}
            {tabValue === "usage" && (
              <MoCard
                sx={{ maxWidth: 500 }}
                key="usageCard"
                initial={{ x: "50%", opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: "50%", opacity: 0 }}
              >
                <TagUsage />
              </MoCard>
            )}
          </Box>
        </AnimatePresence>
      </Container>
    </DragDropContext>
  );
};

export default TagsIndex;

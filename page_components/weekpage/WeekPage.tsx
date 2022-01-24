import { Box, Button, Container, Grid, Typography } from "@mui/material";
import { grey } from "@mui/material/colors";
import { format } from "date-fns";
import type { DecodedIdToken } from "firebase-admin/lib/auth/token-verifier";
import { useRouter } from "next/router";
import type { FC } from "react";
import React, { useEffect, useState } from "react";
import { FaSun } from "react-icons/fa";
import { usePostCtx } from "~/contexts/PostCtx";
import { useTagCtx } from "~/contexts/TagCtx";
import { useDateNav } from "~/hooks/useDateNav";
import CommentInput from "./CommentInput";
import DateCard from "./DateCard";
import PostDisplay from "./PostDisplay";
import axios from "axios";
interface WeekNumPageI {
  user: DecodedIdToken;
  posts: { [date_id: string]: Post };
  startDate: string;
  endDate: string;
  dates: string[];
  myTagSet?: TagDoc;
  error?: any;
}

export const WeekPage: FC<WeekNumPageI> = ({
  user,
  posts,
  startDate,
  endDate,
  dates,
  myTagSet,
  error,
}) => {
  const { postRecordsByDate, recentUpdates } = usePostCtx();
  const { goToToday, goToDateId } = useDateNav();
  const { query } = useRouter();
  const { setMyTags, setTagIds } = useTagCtx();
  const [editing, setEditing] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  //
  //
  if (error) return <pre>{JSON.stringify(error, null, 2)}</pre>;
  //
  //
  const allPosts = { ...posts, ...recentUpdates };
  const date_id = selectedDate && format(selectedDate, "yyyy-MM-dd");
  const today_id = format(new Date(), "yyyy-MM-dd");

  useEffect(() => {
    if (!myTagSet) {
      return;
    }
    setMyTags(myTagSet.tags || {});
    setTagIds(myTagSet.tag_ids || []);
  }, [myTagSet]);

  useEffect(() => {
    if (query.date) {
      setSelectedDate(new Date(`${query.date}T00:00`));
    } else {
      setSelectedDate(null);
    }
  }, [query.date]);

  const stopEditing = () => {
    setEditing(false);
  };
  const startEditing = () => {
    setEditing(true);
  };
  const handleCreatePost = () => {
    setEditing(true);
  };
  return (
    <Container sx={{ p: { xs: 0, md: 2 }, m: 0 }}>
      <Grid
        container
        columns={{ xs: 4, md: 7 }}
        spacing={2}
        sx={{ justifyContent: "center", p: { xs: 1 } }}
      >
        {dates?.map((date_id) => {
          const post = allPosts[date_id];
          return (
            <Grid item key={date_id}>
              <DateCard
                key={date_id}
                date_id={date_id}
                post={post}
                handleClick={() => {
                  setSelectedDate(new Date(`${date_id}T00:00`));
                  goToDateId(date_id);
                }}
              />
            </Grid>
          );
        })}
      </Grid>
      <Box
        mt={2}
        display="flex"
        sx={{
          border: { xs: 0, sm: "1px solid gainsboro" },
          background: grey[100],
          borderRadius: "2rem",
          height: "calc(100vh - 210px)",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-around",
        }}
      >
        {editing ? (
          <Box p={3} width={"100%"}>
            <CommentInput
              selectedDate={selectedDate}
              stopEditing={stopEditing}
              post={date_id ? allPosts[date_id] : undefined}
            />
          </Box>
        ) : date_id && allPosts[date_id] && !allPosts[date_id].removed ? (
          <PostDisplay
            post={allPosts[date_id]}
            startEditing={startEditing}
            selectedDate={selectedDate}
          />
        ) : //
        selectedDate ? (
          <Button
            color="secondary"
            variant="outlined"
            onClick={handleCreatePost}
          >
            Create post for {format(selectedDate, "MMM d")}{" "}
          </Button>
        ) : null}
        <Box display="flex" justifyContent={"center"} mt={3}>
          {today_id !== date_id && !editing && (
            <Button
              startIcon={<FaSun />}
              variant="contained"
              onClick={goToToday}
            >
              Go To Today
            </Button>
          )}
        </Box>
      </Box>
    </Container>
  );
};

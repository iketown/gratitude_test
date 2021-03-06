import { Box, Button, Container, Grid } from "@mui/material";
import { grey } from "@mui/material/colors";
import { format } from "date-fns";
import { doc, onSnapshot } from "firebase/firestore";
import { useRouter } from "next/router";
import type { FC } from "react";
import React, { useEffect, useState } from "react";
import { FaSun } from "react-icons/fa";
import { useAuthCtx } from "~/contexts/AuthCtx";
import { usePostCtx } from "~/contexts/PostCtx";
import { useTagCtx } from "~/contexts/TagCtx";
import { useDateNav } from "~/hooks/useDateNav";
import { getDates } from "~/utils/dateHelpers";
import { db } from "~/utils/firebase";
import CommentInput from "./CommentInput";
import DateCard from "./DateCard";
import PostDisplay from "./PostDisplay";

export const WeekPage: FC = () => {
  const { postRecordsByDate } = usePostCtx();

  const { user_id } = useAuthCtx();
  const { goToToday, goToDateId } = useDateNav();
  const { query, push } = useRouter();
  const { setMyTags, setTagIds } = useTagCtx();
  const [posts, setPosts] = useState<{ [date_id: string]: Post }>({});
  const [editing, setEditing] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  //
  //
  //
  //
  const date_id = selectedDate && format(selectedDate, "yyyy-MM-dd");
  const today_id = format(new Date(), "yyyy-MM-dd");
  const year = query.year as string;
  const week = query.week as string;

  const { dates } = getDates({ year, week });

  useEffect(() => {
    if (!user_id || !date_id) return;

    const unsub = onSnapshot(
      doc(db, "users", user_id, "posts", date_id),
      (doc) => {
        const date_id = doc.id;
        const post = doc.data() as Post;
        setPosts((old) => ({ ...old, [date_id]: post }));
      }
    );
    return unsub;
  }, [date_id, user_id]);

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
    if (!user_id) return push("/auth/signup");
    setEditing(true);
  };

  const getContent = () => {
    switch (true) {
      case editing:
        return (
          <Box p={3} width={"100%"}>
            <CommentInput
              selectedDate={selectedDate}
              stopEditing={stopEditing}
              post={date_id ? posts[date_id] : undefined}
            />
          </Box>
        );
      case !!selectedDate &&
        date_id &&
        posts[date_id] &&
        !posts[date_id].removed: {
        return (
          <PostDisplay
            post={posts[date_id!]}
            startEditing={startEditing}
            selectedDate={selectedDate!}
          />
        );
      }
      case !!selectedDate: {
        return (
          <Button
            color="secondary"
            variant="outlined"
            onClick={handleCreatePost}
          >
            Create post for {format(selectedDate!, "MMM d")}{" "}
          </Button>
        );
      }
      default:
        return null;
    }
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
          const hasPost =
            !!postRecordsByDate[date_id] &&
            postRecordsByDate[date_id] !== "removed";
          return (
            <Grid item key={date_id}>
              <DateCard
                key={date_id}
                date_id={date_id}
                hasPost={hasPost}
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
        {/* {editing ? (
          <Box p={3} width={"100%"}>
            <CommentInput
              selectedDate={selectedDate}
              stopEditing={stopEditing}
              post={date_id ? posts[date_id] : undefined}
            />
          </Box>
        ) : date_id && posts[date_id] && !posts[date_id].removed ? (
          <PostDisplay
            post={posts[date_id]}
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
        ) : null} */}
        {getContent()}
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

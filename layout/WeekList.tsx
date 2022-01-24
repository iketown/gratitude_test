import { SquareTwoTone } from "@mui/icons-material";
import {
  Box,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListSubheader,
  Typography,
} from "@mui/material";
import { blueGrey, grey, orange } from "@mui/material/colors";
import {
  add,
  endOfDay,
  format,
  getWeek,
  getYear,
  isAfter,
  isBefore,
  isSameMonth,
  startOfDay,
} from "date-fns";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { usePostCtx } from "~/contexts/PostCtx";
import { useDateNav } from "~/hooks/useDateNav";
import { getMonthsObj } from "./weekListHelper";

const WeekList = () => {
  const { query } = useRouter();
  const { postRecordsByDate } = usePostCtx();
  const { year, week, date: queryDate } = query;
  const { goToDate } = useDateNav();
  const [months_obj, setMonthsObj] = useState(getMonthsObj());
  const today = endOfDay(new Date());

  useEffect(() => {
    // auto update the calendar at the beginning of the day
    const now = new Date();
    const tmrwMorning = add(startOfDay(now), { days: 1, seconds: 1 });
    const timeLeftTodayMs = tmrwMorning.valueOf() - now.valueOf();

    const timeout = setTimeout(() => {
      setMonthsObj(getMonthsObj());
    }, timeLeftTodayMs);

    return () => {
      clearTimeout(timeout);
    };
  }, []);

  return (
    <div>
      <List
        dense
        sx={{
          width: "100%",
          maxWidth: 360,
          bgcolor: grey[50],
          position: "relative",
          overflow: "auto",
          maxHeight: "70vh",
          "& ul": { padding: 0 },
        }}
        subheader={<li />}
      >
        {Object.entries(months_obj)
          .sort(([idA], [idB]) => (idA < idB ? 1 : -1))
          .map(([month_id, { weeks }]) => {
            const thisMonth = new Date(`${month_id}T00:00`);
            const yearName = format(thisMonth, "yyyy");
            const monthName = format(thisMonth, "MMMM");
            return (
              <li key={`section-${month_id}`}>
                <ul>
                  <ListSubheader sx={{ bgcolor: grey[100] }}>
                    <Typography
                      component={"span"}
                      color="CaptionText"
                      style={{ marginRight: "5px" }}
                    >
                      {monthName}
                    </Typography>
                    <Typography component={"span"}>
                      <Link href="/weeks/[year]" as={`/weeks/${yearName}`}>
                        {yearName}
                      </Link>
                    </Typography>
                  </ListSubheader>
                  {weeks
                    .sort((a, b) => (isBefore(a[0], b[0]) ? 1 : -1))
                    .map((thisWeek, i) => {
                      const myWeek = getWeek(thisWeek[6]);
                      const myYear = getYear(thisWeek[6]);
                      const myKey = `${myWeek}${myYear}${i}`;
                      const isSelected =
                        myWeek === Number(week) && myYear === Number(year);
                      if (isAfter(thisWeek[0], today))
                        return <div key={myKey} />;
                      return (
                        <div key={myKey}>
                          <ListItem key={i} selected={isSelected} dense>
                            <ListItemIcon>
                              <IconButton
                                size="small"
                                onClick={() => goToDate(myYear, myWeek)}
                              >
                                <SquareTwoTone sx={{ color: blueGrey[300] }} />
                              </IconButton>
                            </ListItemIcon>

                            <Box
                              sx={{
                                display: "grid",
                                gridTemplateColumns: "repeat(7,25px)",
                                justifyContent: "center",
                                alignItems: "center",
                              }}
                            >
                              {thisWeek.map((date, i) => {
                                const date_id = format(date, "yyyy-MM-dd");
                                const isSelected = date_id === queryDate;
                                const hasEntry =
                                  postRecordsByDate &&
                                  postRecordsByDate[date_id];
                                const isThisMonth = isSameMonth(
                                  date,
                                  thisMonth
                                );
                                if (!isThisMonth)
                                  return <div key={`${date_id}${i}`} />;
                                if (isAfter(date, today))
                                  return <div key={`${date_id}${i}`} />;
                                return (
                                  <Box
                                    key={`${date_id}${i}`}
                                    onClick={() =>
                                      goToDate(myYear, myWeek, date_id)
                                    }
                                    component="a"
                                    sx={{
                                      cursor: "pointer",
                                      height: 20,
                                      width: 20,
                                      border: isSelected ? 3 : 1,
                                      borderColor: isSelected
                                        ? orange[800]
                                        : "lightgray",

                                      display: "flex",
                                      justifyContent: "center",
                                      alignItems: "center",
                                      marginRight: 1,
                                      fontWeight: hasEntry ? "bold" : "default",
                                      color: hasEntry ? "white" : "GrayText",
                                      backgroundColor: hasEntry
                                        ? blueGrey[500]
                                        : "white",
                                    }}
                                  >
                                    <Typography
                                      variant="caption"
                                      key={`${date_id}${i}`}
                                    >
                                      {format(date, "d")}
                                    </Typography>
                                  </Box>
                                );
                              })}
                            </Box>
                          </ListItem>
                        </div>
                      );
                    })}
                </ul>
              </li>
            );
          })}
      </List>
    </div>
  );
};

export default WeekList;

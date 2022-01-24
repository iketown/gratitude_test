import React from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Typography,
  Box,
  Divider,
  CardActionArea,
} from "@mui/material";
import { blue } from "@mui/material/colors";
import { format, isAfter, endOfDay, isSameDay } from "date-fns";

interface DateCardI {
  date_id: string;
  post?: Post;
  handleClick: () => void;
}
const DateCard: React.FC<DateCardI> = ({ date_id, post, handleClick }) => {
  const today = endOfDay(new Date());
  const date = new Date(`${date_id}T00:00`);
  const inFuture = isAfter(date, today);
  const isToday = isSameDay(date, today);
  const hasPost = !!post && !post.removed;
  return (
    <Card
      variant="elevation"
      sx={{
        width: { xs: 60 },
        backgroundColor: (theme) =>
          hasPost ? theme.palette.primary.light : "",
        color: hasPost ? "white" : "default",
        opacity: inFuture ? 0.2 : 1,
        boxShadow: isToday ? 4 : 1,
        border: 1,
        borderColor: blue[900],
      }}
    >
      <CardActionArea disabled={inFuture} onClick={handleClick}>
        <Box
          sx={{
            pb: 1,
            px: 1,
            pt: 0.5,
          }}
        >
          <Typography textAlign={"center"} color="">
            {format(date, "eee").toUpperCase()}
          </Typography>
          <Typography
            textAlign={"center"}
            fontSize={"12px"}
            color={hasPost ? "white" : "GrayText"}
          >
            {format(date, "MMM d")}
          </Typography>
        </Box>
        <Divider />
      </CardActionArea>
    </Card>
  );
};

export default DateCard;

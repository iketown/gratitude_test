export { getWeekPosts, getUserTagSet } from "./firebase.server";

// import { adminDB, getUser } from "./firebase.server";
// import type { GetServerSidePropsContext, PreviewData } from "next";
// import type { ParsedUrlQuery } from "querystring";
// import { startOfWeek, endOfWeek, add, format } from "date-fns";
// import type { DecodedIdToken } from "firebase-admin/lib/auth/token-verifier";

// interface GetWeekPostsI {
//   ctx: GetServerSidePropsContext<ParsedUrlQuery, PreviewData>;
//   user: DecodedIdToken;
// }
// interface WeekParams extends ParsedUrlQuery {
//   year: string;
//   week: string;
// }
// export const getWeekPosts = async ({ ctx, user }: GetWeekPostsI) => {
//   const { year, week } = ctx.params as WeekParams;
//   const yearStart = new Date(`${year}-01-01T00:00`);
//   const weekStart = startOfWeek(add(yearStart, { weeks: Number(week) - 1 }));

//   const dateFormat = "yyyy-MM-dd";
//   const weekEnd = endOfWeek(weekStart);
//   const startDate = format(weekStart, dateFormat);
//   const endDate = format(weekEnd, dateFormat);
//   const dates = Array.from({ length: 7 }).map((_, i) => {
//     const thisDay = add(weekStart, { days: i });
//     return format(thisDay, dateFormat);
//   });
//   const posts: { [date_id: string]: Post } = {};
//   await adminDB
//     .collection("users")
//     .doc(user.uid)
//     .collection("posts")
//     .where("__name__", ">=", startDate)
//     .where("__name__", "<=", endDate)
//     .get()
//     .then((coll) =>
//       coll.docs.forEach((doc) => {
//         posts[doc.id] = doc.data() as Post;
//       })
//     );

//   return { startDate, endDate, posts, dates };
// };

// export const getUserTagSet = async (user_id: string) => {
//   if (!user_id) throw new Error("no user id supplied to getUserTagSet");
//   const myTagsetRef = adminDB
//     .collection("users")
//     .doc(user_id)
//     .collection("tags")
//     .doc("my_tagset");
//   const myTagSet = await myTagsetRef
//     .get()
//     .then((doc) => doc.exists && doc.data());
//   return myTagSet;
// };

import { WeekPage } from "~/page_components/weekpage/WeekPage";
// import { getUserTagSet, getWeekPosts } from "~/utils/firebaseFxns";
// import { getUser } from "~/utils/firebase.server";
import type { GetServerSideProps } from "next";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  // try {
  //   const user = await getUser(ctx);
  //   if (!user?.uid)
  //     return {
  //       redirect: {
  //         destination: "/auth/signin",
  //         permanent: false,
  //       },
  //     };

  //   const user_id = user.uid;
  //   const { posts, startDate, endDate, dates } = await getWeekPosts({
  //     ctx,
  //     user,
  //   });
  //   const myTagSet = await getUserTagSet(user_id);
  //   return {
  //     props: {
  //       user,
  //       posts,
  //       startDate,
  //       endDate,
  //       dates,
  //       myTagSet,
  //     },
  //   };
  // } catch (error: any) {
  //   return {
  //     props: { error: JSON.stringify(error, null, 2) },
  //   };
  // }
  const foo = "bar";
  return {
    props: { foo },
  };
};

export default WeekPage;

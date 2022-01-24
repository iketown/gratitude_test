import type { GetServerSideProps } from "next";
import React, { useState } from "react";
import { TagsIndex } from "~/page_components/tagspage/TagsPage";
import { adminDB, getUser } from "~/utils/firebase.server";
import { getUserTagSet } from "~/utils/firebaseFxns";

export default TagsIndex;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const user = await getUser(ctx);
  //   resetServerContext();
  if (!user?.uid)
    return {
      redirect: {
        destination: "/auth/signin",
        permanent: false,
      },
    };
  const user_id = user.uid;
  const myTagset = await getUserTagSet(user_id);

  return { props: { myTagset } };
};

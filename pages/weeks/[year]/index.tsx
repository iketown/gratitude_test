import { useRouter } from "next/router";
import React from "react";

const YearOverview = () => {
  const { query } = useRouter();
  return <div>year overview for {query.year}</div>;
};

export default YearOverview;

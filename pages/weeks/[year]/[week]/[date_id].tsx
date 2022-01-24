import { useRouter } from "next/router";
import React from "react";

const DateIdRoute = () => {
  const { query } = useRouter();
  return (
    <div>
      its a date
      <pre>{JSON.stringify(query)}</pre>
    </div>
  );
};

export default DateIdRoute;

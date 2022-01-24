import { GetServerSideProps } from "next";
import React from "react";
import { Button } from "@mui/material";

const SSRTest: React.FC = (props) => {
  return (
    <div>
      SSR test
      <pre style={{ fontSize: 12 }}>{JSON.stringify(props, null, 2)}</pre>
      <Button variant="contained">wussup</Button>
    </div>
  );
};

export default SSRTest;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const foo = "bar";
  return {
    props: { foo },
  };
};

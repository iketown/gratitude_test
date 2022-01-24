import { Button } from "@mui/material";
import { User } from "firebase/auth";
import type { GetServerSideProps } from "next";
import { parseCookies } from "nookies";
import React from "react";

interface UserTestI {
  user?: User;
  error?: any;
  cookies?: any;
  foo: string;
}
const GetUserTest: React.FC<UserTestI> = (props) => {
  const getCookies = () => {
    const cookies = parseCookies();
    console.log({ cookies });
  };
  return (
    <div>
      <h3>props:</h3>
      <pre style={{ fontSize: 10 }}>{JSON.stringify(props, null, 2)}</pre>
      <Button onClick={getCookies}>get cookies</Button>
    </div>
  );
};

export default GetUserTest;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const foo = "bar";
  return {
    props: { foo },
  };
};

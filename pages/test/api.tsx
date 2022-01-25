import React from "react";
import axios from "axios";
import { Button, Container } from "@mui/material";

const ApiTest = () => {
  const handleCall = () => {
    axios.get("/api/hello").then((res) => {
      const response = res.data;
      console.log("axios response", response);
    });
  };
  return (
    <Container>
      <h3>Api Test</h3>
      <Button onClick={handleCall}>CALL</Button>
    </Container>
  );
};

export default ApiTest;

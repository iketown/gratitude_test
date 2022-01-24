import React from "react";
import { useTagCtx } from "~/contexts/TagCtx";
import { Button } from "@mui/material";

const TagUseIndex = () => {
  const { tagUseDoc, setListenToTagUse } = useTagCtx();
  return (
    <div>
      <pre style={{ fontSize: 10 }}>{JSON.stringify(tagUseDoc, null, 2)}</pre>
      <Button
        variant="contained"
        onClick={() => {
          setListenToTagUse(true);
        }}
      >
        listen
      </Button>
    </div>
  );
};

export default TagUseIndex;

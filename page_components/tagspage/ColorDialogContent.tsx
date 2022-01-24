import { Grid, Slider, Typography } from "@mui/material";
import { motion } from "framer-motion";
import type { Dispatch, FC, SetStateAction } from "react";
import React, { useState } from "react";
import { useTagFxns } from "~/hooks/useTagFxns";
import { colors } from "~/utils/tagIcons";

const MotionGridItem = motion(Grid);

const depthMap = {
  0: "A100" as "A100",
  25: "A200" as "A200",
  50: "A400" as "A400",
  75: "A700" as "A700",
  100: "900" as "900",
};

interface ColorDialogContentI {
  colorHex: string;
  setColorHex: Dispatch<SetStateAction<string>>;
}
const ColorDialogContent: FC<ColorDialogContentI> = ({
  colorHex,
  setColorHex,
}) => {
  const [colorDepth, setColorDepth] = useState<keyof typeof depthMap>(50);
  const { updateTag } = useTagFxns();

  const handleSelectColor = (colorName: keyof typeof colors) => {
    const hex = colors[colorName][depthMap[colorDepth]];
    setColorHex(hex);
    console.log("selected", hex);
  };
  const handleSlider = (e: any, newDepth: number | number[]) => {
    const _depth = newDepth as keyof typeof depthMap;
    setColorDepth(_depth);
  };

  return (
    <Grid container spacing={2} justifyContent={"center"}>
      <Grid item xs={12}>
        <div style={{ textAlign: "center" }}>
          <Slider
            sx={{ mx: 5, maxWidth: { xs: 300, sm: 400 } }}
            value={colorDepth}
            onChange={handleSlider}
            step={null}
            marks={[
              { value: 0, label: "lighter" },
              { value: 25, label: "light" },
              { value: 50, label: "med" },
              { value: 75, label: "dark" },
              { value: 100, label: "darker" },
            ]}
          />
        </div>
      </Grid>
      {Object.entries(colors).map(([colorName, color]) => {
        const _colorName = colorName as keyof typeof colors;
        return (
          <MotionGridItem
            key={colorName}
            whileHover={{ scale: 1.1 }}
            onClick={() => {
              handleSelectColor(_colorName);
            }}
            item
            xs={4}
            sm={3}
            md={2}
            sx={{
              height: "100%",
              width: "100%",
              m: 1,
              p: 4,
              position: "relative",
              cursor: "pointer",
            }}
            bgcolor={color[depthMap[colorDepth]]}
          >
            <Typography
              variant="overline"
              sx={{
                color: colorDepth > 49 ? "white" : "black",
                m: 0,
                p: 0,
                position: "absolute",
                bottom: 0,
                right: 0,
                lineHeight: 1,
              }}
            >
              {colorName}
            </Typography>
          </MotionGridItem>
        );
      })}
    </Grid>
  );
};

export default ColorDialogContent;

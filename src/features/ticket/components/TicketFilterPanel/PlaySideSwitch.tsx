import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import React from "react";

import { PlaySide } from "../../../../types";

type PlaySideSwitchProps = {
  value: PlaySide;
  onChange: (side: PlaySide) => void;
};

export const PlaySideSwitch: React.FC<PlaySideSwitchProps> = ({ value, onChange }) => {
  const handleChange = (_event: React.MouseEvent<HTMLElement>, newValue: PlaySide | null) => {
    if (newValue) onChange(newValue);
  };

  return (
    <ToggleButtonGroup size="large" value={value} color="primary" exclusive onChange={handleChange}>
      <ToggleButton value="1P">1P</ToggleButton>
      <ToggleButton value="2P">2P</ToggleButton>
    </ToggleButtonGroup>
  );
};

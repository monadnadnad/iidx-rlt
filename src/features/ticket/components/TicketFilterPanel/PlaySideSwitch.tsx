import React from "react";

import { PlaySideToggle } from "../../../../components/ui/PlaySideToggle";
import { PlaySide } from "../../../../types";

type PlaySideSwitchProps = {
  value: PlaySide;
  onChange: (side: PlaySide) => void;
};

export const PlaySideSwitch: React.FC<PlaySideSwitchProps> = ({ value, onChange }) => (
  <PlaySideToggle value={value} onChange={onChange} />
);

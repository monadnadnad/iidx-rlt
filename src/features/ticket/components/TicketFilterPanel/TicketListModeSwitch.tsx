import { FormControlLabel, Switch } from "@mui/material";
import React from "react";

type TicketListModeSwitchProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
};

export const TicketListModeSwitch: React.FC<TicketListModeSwitchProps> = ({ checked, onChange }) => (
  <FormControlLabel
    control={<Switch size="small" checked={checked} onChange={(_event, nextChecked) => onChange(nextChecked)} />}
    label="重複をまとめる"
    sx={{
      m: 0,
      ".MuiFormControlLabel-label": {
        fontSize: "0.875rem",
        color: "text.secondary",
        whiteSpace: "nowrap",
      },
    }}
  />
);

import { Checkbox, FormControlLabel, FormGroup, Stack, Typography } from "@mui/material";
import type { FC, ReactNode } from "react";

export type TextageFilterOption = {
  key: string | number;
  label: string;
  checked: boolean;
  onToggle: () => void;
};

interface TextageFilterSectionProps {
  title: ReactNode;
  options: TextageFilterOption[];
}

export const TextageFilterSection: FC<TextageFilterSectionProps> = ({ title, options }) => (
  <Stack spacing={1} sx={{ flex: 1, minWidth: 200 }}>
    <Typography variant="subtitle2" color="text.secondary">
      {title}
    </Typography>
    <FormGroup row sx={{ flexWrap: "wrap", gap: 1 }}>
      {options.map((option) => (
        <FormControlLabel
          key={option.key}
          control={<Checkbox checked={option.checked} onChange={option.onToggle} size="small" />}
          label={option.label}
        />
      ))}
    </FormGroup>
  </Stack>
);

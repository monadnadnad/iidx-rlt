import { Checkbox, FormControl, FormControlLabel, TextFieldProps } from "@mui/material";
import { useFormContext } from "react-hook-form";

import { LaneTextInput } from "../../../components/ui/LaneTextInput";
import type { SearchFormValues } from "../../../schema";

type PatternInputProps = {
  label: string;
  name: "scratchSideText" | "nonScratchSideText";
  checkboxName: "isScratchSideUnordered" | "isNonScratchSideUnordered";
  length: 3 | 4;
} & Omit<TextFieldProps, "name" | "length" | "label">;

export const PatternInput: React.FC<PatternInputProps> = ({ label, name, checkboxName, length, ...rest }) => {
  const { register } = useFormContext<SearchFormValues>();
  const { slotProps, ...textFieldProps } = rest;
  const combinedSlotProps: TextFieldProps["slotProps"] = {
    ...(slotProps ?? {}),
    inputLabel: {
      shrink: true,
      ...(slotProps?.inputLabel ?? {}),
    },
  };

  return (
    <FormControl>
      <LaneTextInput name={name} length={length} label={label} slotProps={combinedSlotProps} {...textFieldProps} />
      <FormControlLabel
        control={<Checkbox defaultChecked {...register(checkboxName)} />}
        label="順不同"
        slotProps={{ typography: { color: "text.secondary" } }}
      />
    </FormControl>
  );
};

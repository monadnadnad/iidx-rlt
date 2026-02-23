import { Box, Checkbox, FormControl, FormControlLabel, TextField } from "@mui/material";
import React from "react";
import { Controller, useFormContext } from "react-hook-form";

import type { PlaySide } from "../../../../types";
import type { SearchFormValues } from "../../searchForm";

type PatternInputProps = {
  playSide: PlaySide;
};

export const PatternInput: React.FC<PatternInputProps> = ({ playSide }) => {
  const is1P = playSide === "1P";
  const { control, register } = useFormContext<SearchFormValues>();

  const inputs = [
    {
      key: "scratch",
      label: is1P ? "左側の3つが" : "右側の3つが",
      name: "scratchSideText" as const,
      checkboxName: "isScratchSideUnordered" as const,
      length: 3,
      placeholder: "***",
      helperText: "例: 1*3",
    },
    {
      key: "non-scratch",
      label: is1P ? "右側の4つが" : "左側の4つが",
      name: "nonScratchSideText" as const,
      checkboxName: "isNonScratchSideUnordered" as const,
      length: 4,
      placeholder: "****",
      helperText: "例: 45*7",
    },
  ];

  return (
    <Box
      sx={{
        display: "flex",
        gap: 1,
        justifyContent: is1P ? "flex-start" : "flex-end",
        flexDirection: is1P ? "row" : "row-reverse",
      }}
    >
      {inputs.map(({ key, label, name, checkboxName, length, placeholder, helperText }) => (
        <FormControl key={key} sx={{ gap: 0.5, alignItems: "flex-start" }}>
          <Controller
            name={name}
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                label={label}
                placeholder={placeholder}
                error={!!fieldState.error}
                helperText={fieldState.error?.message ?? helperText}
                slotProps={{
                  inputLabel: { shrink: true },
                  input: {
                    inputProps: {
                      maxLength: length,
                      inputMode: "tel",
                      style: {
                        textAlign: "center",
                        letterSpacing: "0.8em",
                        fontFamily: "monospace",
                        fontWeight: "bold",
                        padding: "0.5em",
                      },
                    },
                  },
                }}
                sx={{ width: `${length * 2 + 1}em` }}
              />
            )}
          />
          <FormControlLabel
            control={<Checkbox defaultChecked {...register(checkboxName)} />}
            label="順不同"
            slotProps={{ typography: { color: "text.secondary" } }}
          />
        </FormControl>
      ))}
    </Box>
  );
};

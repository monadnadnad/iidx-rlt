import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Stack, TextField } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import { createLaneTextSchema } from "../../../../utils/laneText";

type LaneTextFormProps = {
  onSubmit: (laneText: string) => Promise<void>;
};

const laneTextSchema = z.object({
  laneText: createLaneTextSchema(7, { allowWildcard: false, requireFullLength: true }),
});

export const LaneTextForm: React.FC<LaneTextFormProps> = ({ onSubmit }) => {
  const { control, handleSubmit, formState, reset } = useForm({
    resolver: zodResolver(laneTextSchema),
    defaultValues: { laneText: "" },
  });

  const submit = handleSubmit(async ({ laneText }) => {
    await onSubmit(laneText);
    reset();
  });

  return (
    <form onSubmit={submit} style={{ width: "100%" }}>
      <Stack direction="row" spacing={1} sx={{ width: "100%", pb: 1 }}>
        <Controller
          name="laneText"
          control={control}
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              size="small"
              disabled={formState.isSubmitting}
              placeholder="例: 1234576"
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
              sx={{ flexGrow: 1, maxWidth: 220, minWidth: 160 }}
              slotProps={{
                htmlInput: {
                  maxLength: 7,
                  inputMode: "numeric",
                  pattern: "[1-7]*",
                  style: { textAlign: "center" },
                },
              }}
            />
          )}
        />
        <Button type="submit" variant="contained" disabled={formState.isSubmitting} sx={{ alignSelf: "flex-start" }}>
          追加
        </Button>
      </Stack>
    </form>
  );
};

import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Stack } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { jaJP } from "@mui/x-date-pickers/locales";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
import "dayjs/locale/ja";
import { useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";

import { LaneTextInput } from "../../../components/ui/LaneTextInput";
import { manualImportFormSchema, ManualImportFormValues } from "../../../schema";
import { Ticket } from "../../../types";

interface ManualImportFormProps {
  onImport: (ticket: Ticket) => void;
  isLoading: boolean;
}

export const ManualImportForm = ({ onImport, isLoading }: ManualImportFormProps) => {
  const [showExpiration, setShowExpiration] = useState(false);
  const methods = useForm<ManualImportFormValues>({
    resolver: zodResolver(manualImportFormSchema),
    defaultValues: {
      laneText: "",
      expiration: "",
    },
  });
  const {
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = methods;

  const onSubmit = (values: ManualImportFormValues) => {
    const expiration = values.expiration?.trim() ?? "";
    const hasExpiration = expiration !== "";
    const ticket: Ticket = hasExpiration ? { laneText: values.laneText, expiration } : { laneText: values.laneText };
    onImport(ticket);
    reset({ laneText: "", expiration: values.expiration ?? "" });
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2} alignItems="flex-start">
          <Stack direction="row" spacing={2} alignItems="flex-start">
            <LaneTextInput
              name="laneText"
              label="チケット"
              length={7}
              placeholder="1234567"
              size="small"
              slotProps={{ inputLabel: { shrink: true } }}
            />
            <Button type="submit" variant="contained" disabled={isLoading}>
              追加
            </Button>
          </Stack>
          {showExpiration ? (
            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ja">
              <Controller
                name="expiration"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    label="有効期限"
                    value={field.value ? dayjs(field.value, "YYYY/MM/DD", true) : null}
                    onChange={(newValue) => {
                      field.onChange(newValue ? newValue.format("YYYY/MM/DD") : "");
                    }}
                    format="YYYY / MM / DD"
                    disablePast
                    localeText={jaJP.components.MuiLocalizationProvider.defaultProps.localeText}
                    slotProps={{
                      field: { clearable: true },
                      calendarHeader: { format: "YYYY年 MM月" },
                      toolbar: { toolbarFormat: "YYYY年 M月 D日" },
                      textField: {
                        InputLabelProps: { shrink: true },
                        size: "small",
                        error: !!errors.expiration,
                        helperText: errors.expiration?.message,
                      },
                    }}
                  />
                )}
              />
            </LocalizationProvider>
          ) : (
            <Button variant="text" onClick={() => setShowExpiration(true)}>
              有効期限を入力する（任意）
            </Button>
          )}
        </Stack>
      </form>
    </FormProvider>
  );
};

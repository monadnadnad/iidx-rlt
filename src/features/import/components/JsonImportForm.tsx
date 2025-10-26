import React from "react";
import { TextField, Button, CircularProgress } from "@mui/material";

interface JsonImportFormProps {
  isLoading: boolean;
  jsonText: string;
  onTextChange?: (text: string) => void;
  onImportClick?: () => void;
}

export const JsonImportForm: React.FC<JsonImportFormProps> = ({ jsonText, onTextChange, onImportClick, isLoading }) => {
  return (
    <>
      <TextField
        multiline
        rows={6}
        fullWidth
        value={jsonText}
        onChange={(e) => onTextChange?.(e.target.value)}
        placeholder="ここにコピーしたデータを貼り付けます"
        disabled={isLoading}
      />
      <Button
        variant="contained"
        onClick={onImportClick}
        disabled={isLoading || !jsonText}
        size="large"
        startIcon={isLoading ? <CircularProgress color="inherit" size={20} /> : null}
        sx={{ mt: 2 }}
      >
        インポート実行
      </Button>
    </>
  );
};

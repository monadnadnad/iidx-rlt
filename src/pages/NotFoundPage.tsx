import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { Link } from "react-router";

export const NotFoundPage: React.FC = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "60vh",
        textAlign: "center",
      }}
    >
      <Typography variant="h4" gutterBottom>
        ページが見つかりません
      </Typography>
      <Button component={Link} to="/" variant="contained" sx={{ mt: 4 }}>
        トップに戻る
      </Button>
    </Box>
  );
};

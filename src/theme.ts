import { createTheme, PaletteMode } from "@mui/material";

declare module "@mui/material/styles" {
  interface Palette {
    highlight: {
      gold: string;
      silver: string;
      bronze: string;
    };
    difficulty: {
      hyper: string;
      another: string;
      leggendaria: string;
    };
  }

  interface PaletteOptions {
    highlight?: {
      gold?: string;
      silver?: string;
      bronze?: string;
    };
    difficulty?: {
      hyper?: string;
      another?: string;
      leggendaria?: string;
    };
  }
}

export const getTheme = (mode: PaletteMode) =>
  createTheme({
    palette: {
      mode,
      highlight: {
        gold: "#FFD700",
        silver: "#C0C0C0",
        bronze: "#CD7F32",
      },
      difficulty: {
        hyper: "#f2b800",
        another: "#d32f2f",
        leggendaria: "#8e24aa",
      },
    },
    typography: {
      fontFamily: ['"Noto Sans JP"', '"Segoe UI"', '"Helvetica Neue"', "Arial", "sans-serif"].join(","),
    },
    components: {
      MuiTextField: {
        defaultProps: {
          variant: "outlined",
          slotProps: { inputLabel: { shrink: true } },
        },
      },
      MuiToggleButton: {
        styleOverrides: {
          root: {
            padding: "4px 16px",
          },
        },
      },
      MuiCard: {
        variants: [
          {
            props: { variant: "outlined" },
            style: ({ theme }) => ({
              borderRadius: theme.shape.borderRadius,
            }),
          },
        ],
      },
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: "none",
          },
        },
      },
    },
  });

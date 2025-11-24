import "@mui/material/styles";

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
    highlight?: Partial<Palette["highlight"]>;
    difficulty?: Partial<Palette["difficulty"]>;
  }
}

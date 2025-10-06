import LaunchIcon from "@mui/icons-material/Launch";
import { Link, Typography } from "@mui/material";
import { MouseEventHandler } from "react";

interface TextageLinkProps {
  href?: string;
  onFollow?: () => void;
}

export const TextageLink = ({ href, onFollow }: TextageLinkProps) => {
  const handleClick: MouseEventHandler<HTMLAnchorElement> = (event) => {
    event.stopPropagation();
    onFollow?.();
  };

  return (
    <Link
      href={href}
      visibility={href ? "visible" : "hidden"}
      target="_blank"
      rel="noopener noreferrer"
      underline="hover"
      variant="body1"
      color="text.secondary"
      onClick={handleClick}
      sx={{ display: "inline-flex", alignItems: "center", gap: 0.5 }}
      aria-label="Textageで確認"
    >
      <LaunchIcon fontSize="inherit" />
      <Typography component="span" variant="inherit">
        Textage
      </Typography>
    </Link>
  );
};

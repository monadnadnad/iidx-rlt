import CloseIcon from "@mui/icons-material/Close";
import LaunchIcon from "@mui/icons-material/Launch";
import { Box, IconButton, List, ListItem, ListItemText, Typography } from "@mui/material";
import ReactGA from "react-ga4";

import { FloatingSheet } from "../../../components/ui/FloatingSheet";
import { useSettingsStore } from "../../../store/settingsStore";
import { AtariRule, Ticket } from "../../../types";
import { makeTextageUrl } from "../../../utils/makeTextageUrl";

interface AtariInfoSheetProps {
  ticket: Ticket;
  rules: AtariRule[];
  onClose: () => void;
}

export const AtariInfoSheet = ({ ticket, rules, onClose }: AtariInfoSheetProps) => {
  const playSide = useSettingsStore((s) => s.playSide);

  const handleOpenTextage = (rule: AtariRule) => {
    ReactGA.event("click_textage_link_from_detail", {
      song_title: rule.title,
      lane_text: ticket.laneText,
      play_side: playSide,
    });
    const url = makeTextageUrl(rule.url, playSide, ticket.laneText);
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const sheetTitle = (
    <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
      <Typography variant="h6" sx={{ flexGrow: 1 }}>
        <Box component="span">{ticket.laneText}</Box>
        <Box component="span" sx={{ color: "text.secondary", ml: 1, fontSize: "0.875rem" }}>
          の当たり配置候補
        </Box>
      </Typography>
      <IconButton onClick={onClose}>
        <CloseIcon />
      </IconButton>
    </Box>
  );

  return (
    <FloatingSheet open={!!ticket} onClose={onClose} title={sheetTitle}>
      <List>
        {rules.map((rule) => (
          <ListItem key={rule.id} disablePadding>
            <ListItemText primary={rule.title} secondary={rule.description} />
            <IconButton onClick={() => handleOpenTextage(rule)}>
              <LaunchIcon />
            </IconButton>
          </ListItem>
        ))}
      </List>
    </FloatingSheet>
  );
};

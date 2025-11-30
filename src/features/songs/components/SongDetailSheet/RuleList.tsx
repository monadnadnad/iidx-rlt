import { Divider, List, ListItem, ListItemText, Typography } from "@mui/material";

import type { SearchPattern, PlaySide, AtariRule } from "../../../../types";

type RuleListProps = {
  rules: AtariRule[];
  playSide: PlaySide;
};

const formatPattern = (playSide: PlaySide, pattern: SearchPattern) =>
  playSide === "1P"
    ? `${pattern.scratchSideText} | ${pattern.nonScratchSideText}`
    : `${pattern.nonScratchSideText} | ${pattern.scratchSideText}`;

export const RuleList: React.FC<RuleListProps> = ({ rules, playSide }) => {
  if (rules.length === 0) return null;

  return (
    <>
      <Divider sx={{ my: 2 }} />
      <Typography>当たり配置の例</Typography>
      <List dense sx={{ maxHeight: 150, overflowY: "auto" }}>
        {rules.flatMap((rule) =>
          rule.patterns.map((pattern, idx) => (
            <ListItem key={`${rule.id}-${idx}`} disableGutters>
              <ListItemText primary={formatPattern(playSide, pattern)} secondary={rule.description} />
            </ListItem>
          ))
        )}
      </List>
    </>
  );
};

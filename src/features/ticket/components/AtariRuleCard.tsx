import React from "react";
import { Card, CardContent, CardHeader, Divider, List, ListItem, ListItemText, Typography } from "@mui/material";
import { AtariRule, PlaySide, SearchPattern } from "../../../types";

interface AtariRuleCardProps {
  rules: AtariRule[];
  playSide: PlaySide;
}

const formatPattern = (pattern: SearchPattern, playSide: PlaySide): string => {
  const sPart = `${pattern.scratchSideText}${pattern.isScratchSideUnordered ? " (順不同)" : ""}`;
  const nsPart = `${pattern.nonScratchSideText}${pattern.isNonScratchSideUnordered ? " (順不同)" : ""}`;
  return playSide === "1P" ? `${sPart} | ${nsPart}` : `${nsPart} | ${sPart}`;
};

export const AtariRuleCard: React.FC<AtariRuleCardProps> = ({ rules, playSide }) => {
  if (!rules || rules.length === 0) return null;

  return (
    <Card variant="outlined">
      <CardHeader
        disableTypography
        title={
          <Typography variant="subtitle1" component="h2">
            当たり配置になるチケットのパターン
          </Typography>
        }
        sx={{ pb: 1.5, px: 2, pt: 2 }}
      />
      <Divider sx={{ mx: 2 }} />
      <CardContent sx={{ pt: 2, pb: 1 }}>
        <List dense>
          {rules.flatMap((rule) =>
            rule.patterns.map((pattern, index) => (
              <ListItem key={`${rule.id}-${index}`} disableGutters>
                <ListItemText primary={formatPattern(pattern, playSide)} secondary={rule.description} />
              </ListItem>
            ))
          )}
        </List>
      </CardContent>
    </Card>
  );
};

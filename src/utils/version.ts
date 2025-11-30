export const VERSION_NAMES = [
  "1st style",
  "substream",
  "2nd style",
  "3rd style",
  "4th style",
  "5th style",
  "6th style",
  "7th style",
  "8th style",
  "9th style",
  "10th style",
  "IIDX RED",
  "HAPPY SKY",
  "DistorteD",
  "GOLD",
  "DJ TROOPERS",
  "EMPRESS",
  "SIRIUS",
  "Resort Anthem",
  "Lincle",
  "tricoro",
  "SPADA",
  "PENDUAL",
  "copula",
  "SINOBUZ",
  "CANNON BALLERS",
  "Rootage",
  "HEROIC VERSE",
  "BISTROVER",
  "CastHour",
  "RESIDENT",
  "EPOLIS",
  "Pinky Crush",
  "Sparkle Shower",
] as const;

export const resolveVersionName = (version: number, versionNames: readonly string[] = VERSION_NAMES): string => {
  if (Number.isFinite(version) && version >= 0 && version < versionNames.length) {
    return versionNames[version];
  }
  if (version === -1) {
    return "CS";
  }
  return `IIDX ${version}`;
};

const APPLY = "APPLY";
const ACCEPT_APPLICATION = "ACCEPT_APPLICATION";
const REJECT_APPLICATION = "REJECT_APPLICATION";
const RESCIND = "rescind";
const EDIT = "EDIT";
const SUCCESS = "SUCCESS";
const DANGER = "DANGER";
const PRIMARY = "PRIMARY";
const YES = "YES";
const NO = "NO";

const classes = [
  "Berserker",
  "Paladin",
  "Gunlancer",
  "Destroyer",
  "Striker",
  "Wardancer",
  "Scrapper",
  "Soulfist",
  "Glavier",
  "Gunslinger",
  "Artillerist",
  "Deadeye",
  "Sharpshooter",
  "Bard",
  "Sorceress",
  "Arcana",
  "ShadowHunter",
  "Deathblade",
];

const supportClasses = new Set(["Paladin", "Bard", "Artist"]);

const content = [
  "Argos P1",
  "Argos P2",
  "Argos P3",
  "Normal Valtan",
  "Hard Mode Valtan",
  "Normal Vykas",
  "Hard Mode Vykas",
];

module.exports = {
  APPLY,
  ACCEPT_APPLICATION,
  REJECT_APPLICATION,
  RESCIND,
  EDIT,
  SUCCESS,
  DANGER,
  PRIMARY,
  YES,
  NO,
  classes,
  supportClasses,
  content,
};

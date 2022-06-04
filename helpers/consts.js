const APPLY = "apply";
const ACCEPT_APPLICATION = "acceptapplication";
const REJECT_APPLICATION = "rejectapplication";
const RESCIND = "rescind";
const EDIT = "EDIT";
const SUCCESS = "SUCCESS";
const DANGER = "DANGER";
const PRIMARY = "PRIMARY";

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
  classes,
  supportClasses,
  content,
};

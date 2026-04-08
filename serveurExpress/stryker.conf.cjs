module.exports = {
  mutate: [
    "api/dao/recuperationUtilisationDAO.js",
    "api/dao/stationFetchDAO.mjs",
    "api/dao/transmissionClientDAO.js",
    "api/dao/recuperationTraitementDAO.js",
    "api/controller/stationController.mjs",
  ],
  testRunner: "command",
  commandRunner: {
    command: "npm test"
  },
  coverageAnalysis: "off",
  reporters: ["progress", "clear-text", "html"]
};

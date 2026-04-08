module.exports = {
  mutate: [
    "api/dao/recuperationUtilisationDAO.js",
    "api/dao/stationFetchDAO.mjs",
    "api/dao/transmissionClientDAO.js"
  ],
  testRunner: "command",
  commandRunner: {
    command: "npm test"
  },
  coverageAnalysis: "off",
  reporters: ["progress", "clear-text", "html"]
};

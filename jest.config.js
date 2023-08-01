module.exports = {
  verbose: false,
  testPathIgnorePatterns: ["/node_modules/"],
  testMatch: ["**/__tests__/**/*.[jt]s?(x)", "**/?(*.)+(test).[jt]s?(x)"],
  reporters: [
    ["github-actions", { silent: false }],
    ["jest-junit", { outputDirectory: "reports", outputName: "reportApi.xml" }],
    "summary",
    "default",
  ],
  testTimeout: 25000,
  setupFilesAfterEnv: ['jest-geojson/setup/all']
};

module.exports = {
  "roots": [
    ".",
  ],
  "transform": {
    "^.+\\.tsx?$": "ts-jest",
  },
  "testRegex": "\\.test\\.tsx?$",
  "moduleFileExtensions": [
    "ts",
    "tsx",
    "js",
    "jsx",
    "json",
    "node",
  ],
  "preset": "jest-puppeteer",
};

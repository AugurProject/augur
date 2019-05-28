module.exports = {
  "roots": [
    "<rootDir>",
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
  "testURL": "http://localhost:8080/",
  "globalSetup": "./setup.js",
};

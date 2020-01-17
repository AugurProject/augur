module.exports = {
  "roots": [
    "<rootDir>/src/tests/api",
    "<rootDir>/src/tests/connector",
    "<rootDir>/src/tests/flash", // has a single very long test
    "<rootDir>/src/tests/state",
    "<rootDir>/src/tests/templates",
    // "<rootDir>/src/tests/ui", // disabled because this has its own jest config
    "<rootDir>/src/tests/warp",
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
  "setupFilesAfterEnv": ["./setupEnv.js"]
};

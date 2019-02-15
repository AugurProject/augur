module.exports = {
  "roots": [
    "<rootDir>/src",
  ],
  transform: {
    "^.+\\.tsx?$": "babel-jest",
  },
  "testRegex": "[\\./]test\\.tsx?$",
  "moduleFileExtensions": [
    "ts",
    "tsx",
    "js",
    "jsx",
    "json",
    "node",
  ],
  "testURL": "http://localhost:8080/",
};

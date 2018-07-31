module.exports = function (wallaby) { // eslint-disable-line
  return {
    files: [
      "build/**/*",
      "src/**/*",
      "*.js",
    ],
    tests: [
      "test/**/*.ts",
    ],
    env: {
      type: "node",
    },
    testFramework: "mocha",
  };
};

process.env.NODE_ENV = "test";
module.exports = function(wallaby) {
  // eslint-disable-line
  return {
    files: [
      "src/**/*.@(js|jsx|json|less)",
      "!src/**/*[.-]test.js?(x)",
      "test/testState.js"
    ],
    tests: ["src/**/*[.-]test.js?(x)"],
    compilers: {
      "**/*.js?(x)": wallaby.compilers.babel()
    },
    env: {
      type: "node",
      runner: "node"
    },

    testFramework: "jest",

    setup(wallaby) {
      const jestConfig = require("./package.json").jest;
      // for example:
      // jestConfig.globals = { "__DEV__": true };
      wallaby.testFramework.configure(jestConfig);
    }
  };
};

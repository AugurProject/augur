module.exports = {
  presets: [["@babel/preset-react"], ["@babel/preset-env", {"useBuiltIns":"entry", "targets":"> 0.25%, not dead, Chrome >= 41"}]],
  plugins: [
    "@babel/plugin-proposal-class-properties",
    "@babel/plugin-syntax-dynamic-import",
    "@babel/plugin-transform-runtime"
  ]
};

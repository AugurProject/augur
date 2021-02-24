"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _logo = require("./components/common/logo");

Object.keys(_logo).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _logo[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _logo[key];
    }
  });
});
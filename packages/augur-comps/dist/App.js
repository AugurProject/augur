"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _AppStyles = _interopRequireDefault(require("./App.styles.less"));

require("./assets/styles/shared.less");

var _marketCard = require("./components/market-card/market-card");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function App() {
  return /*#__PURE__*/React.createElement("div", {
    className: _AppStyles.default.App
  }, "Market card:", /*#__PURE__*/React.createElement(_marketCard.MarketCard, {
    marketId: '0x0cc49229b93f87f97f657931b50c67af3f9b7845'
  }));
}

var _default = App;
exports.default = _default;
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getMarketsData = getMarketsData;
exports.getBlockFromTimestamp = getBlockFromTimestamp;
exports.ETH = exports.CASH_TOKEN_DATA = void 0;

var _apolloBoost = _interopRequireDefault(require("apollo-boost"));

var _dayjs = _interopRequireDefault(require("dayjs"));

var _utc = _interopRequireDefault(require("dayjs/plugin/utc"));

var _apolloCacheInmemory = require("apollo-cache-inmemory");

var _graphqlTag = _interopRequireDefault(require("graphql-tag"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _templateObject() {
  var data = _taggedTemplateLiteral(["\n  query tokenDayDatas($tokenAddr: String!) {\n    tokenDayDatas(first: 1, orderBy: date, orderDirection: desc, where: { token: $tokenAddr }) {\n      id\n      date\n      priceUSD\n    }\n  }\n"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

// // @ts-ignore
console.log(process);
var PARA_CONFIG = process.env.CONFIGURATION || {}; // @ts-ignore

var GET_BLOCK = function GET_BLOCK(timestamp) {
  var queryString = "\n  {\n    blocks(\n      first: 1\n      orderBy: timestamp\n      orderDirection: asc\n      where: { timestamp_gt: ".concat(timestamp, ", timestamp_lt: ").concat(timestamp + 600, " }\n    ) {\n      id\n      number\n      timestamp\n    }\n  }\n");
  return (0, _graphqlTag.default)(queryString);
}; // Get all markets except CATEGORICAL
// https://thegraph.com/explorer/subgraph/augurproject/augur-v2-staging
// @ts-ignore


var GET_MARKETS = function GET_MARKETS(blockNumber) {
  var queryString = "\n  {\n  markets(where: { marketType: YES_NO, description_not: null, fee_lte: 20000000000000000 }) {\n    description\n    id\n    outcomes {\n      id\n      value\n      isFinalNumerator\n      payoutNumerator\n    }\n    marketType\n    numTicks\n    timestamp\n    fee\n    openInterest\n    outcomeVolumes\n    prices\n    designatedReporter\n    extraInfoRaw\n    currentDisputeWindow {\n      id\n      endTime\n    }\n    shareTokens {\n      id\n    }\n    owner {\n      id\n    }\n    creator {\n      id\n    }\n    offsetName\n    template {\n      id\n      question\n    }\n    noShowBond\n    universe {\n      id\n      reportingFee\n    }\n    endTimestamp\n    status\n    categories\n    tradingProceedsClaimed {\n      id\n\t\t\tshareToken {\n        id\n      }\n      sender {\n        id\n      }\n      outcome\n      numPayoutTokens\n      fees\n      timestamp\n    }\n    amms {\n      id\n      shareToken {\n        id\n        cash {\n          id\n        }\n      }\n      volumeYes\n      volumeNo\n      percentageYes\n      percentageNo\n      liquidity\n      liquidityYes\n      liquidityNo\n      liquidityInvalid\n      totalSupply\n      cashBalance\n      fee\n      feePercent\n      swaps {\n        id\n        sender {\n          id\n        }\n        tx_hash\n        timestamp\n        yesShares\n        noShares\n      }\n      enters {\n        id\n        sender {\n          id\n        }\n        tx_hash\n        timestamp\n        yesShares\n        noShares\n        price\n        cash\n      }\n      exits {\n        id\n        sender {\n          id\n        }\n        tx_hash\n        price\n        timestamp\n        yesShares\n        noShares\n        cash\n      }\n      addLiquidity {\n        id\n        sender {\n          id\n        }\n        tx_hash\n        timestamp\n        yesShares\n        noShares\n        cash\n        cashValue\n        lpTokens\n        noShareCashValue\n        yesShareCashValue\n        netShares\n      }\n      removeLiquidity {\n        id\n        sender {\n          id\n        }\n        tx_hash\n        timestamp\n        yesShares\n        noShares\n        cashValue\n        noShareCashValue\n        yesShareCashValue\n      }\n    }\n  }\n  paraShareTokens {\n    id\n    cash {\n      id\n      decimals\n      symbol\n    }\n  }\n  past: markets(block: { number: ".concat(blockNumber, " }, where: { marketType: YES_NO, description_not: null }) {\n    description\n    id\n    endTimestamp\n    status\n    amms {\n      id\n      shareToken {\n        id\n        cash {\n          id\n        }\n      }\n      volumeYes\n      volumeNo\n      percentageYes\n      percentageNo\n      liquidity\n      liquidityYes\n      liquidityNo\n      liquidityInvalid\n      totalSupply\n      cashBalance\n      swaps {\n        id\n        tx_hash\n        timestamp\n        yesShares\n        noShares\n      }\n      enters {\n        id\n        tx_hash\n        timestamp\n        yesShares\n        noShares\n        price\n        cash\n      }\n      exits {\n        id\n        tx_hash\n        timestamp\n        yesShares\n        noShares\n        price\n        cash\n      }\n    }\n  }\n}\n ");
  return (0, _graphqlTag.default)(queryString);
};

var CASH_TOKEN_DATA = (0, _graphqlTag.default)(_templateObject());
exports.CASH_TOKEN_DATA = CASH_TOKEN_DATA;

_dayjs.default.extend(_utc.default);

var defaultOptions = {
  watchQuery: {
    fetchPolicy: 'no-cache',
    errorPolicy: 'ignore'
  },
  query: {
    fetchPolicy: 'no-cache',
    errorPolicy: 'all'
  }
};
var client = augurV2Client('https://api.thegraph.com/subgraphs/name/ianlapham/uniswapv2');
var healthClient = augurV2Client('https://api.thegraph.com/index-node/graphql');

function blockClient(uri) {
  return new _apolloBoost.default({
    uri: uri
  });
}

function augurV2Client(uri) {
  var client = new _apolloBoost.default({
    uri: uri,
    cache: new _apolloCacheInmemory.InMemoryCache({
      addTypename: false
    })
  });
  client.defaultOptions = defaultOptions;
  return client;
} // // @ts-ignore


function getMarketsData(_x) {
  return _getMarketsData.apply(this, arguments);
} // https://thegraph.com/explorer/subgraph/augurproject/augur-v2-staging
// kovan playground


function _getMarketsData() {
  _getMarketsData = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(updateHeartbeat) {
    var clientConfig, response, responseUsd, newBlock, query, _response;

    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            //const cashes = getCashesInfo();
            clientConfig = getClientConfig();
            response = null;
            responseUsd = null;
            newBlock = null;
            _context3.prev = 4;
            _context3.next = 7;
            return getPastDayBlockNumber(clientConfig.blockClient);

          case 7:
            newBlock = _context3.sent;
            query = GET_MARKETS(newBlock);
            _context3.next = 11;
            return augurV2Client(clientConfig.augurClient).query({
              query: query
            });

          case 11:
            response = _context3.sent;
            _context3.next = 18;
            break;

          case 14:
            _context3.prev = 14;
            _context3.t0 = _context3["catch"](4);
            console.error(_context3.t0);
            updateHeartbeat(null, null, _context3.t0);

          case 18:
            //if (!responseUsd) return updateHeartbeat(null, null, 'Data could not be retreived');
            if (response) {
              if (response.errors) {
                console.error(JSON.stringify(response.errors, null, 1));
              }

              updateHeartbeat(_objectSpread({}, response.data), newBlock, (_response = response) === null || _response === void 0 ? void 0 : _response.errors);
            }

          case 19:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, null, [[4, 14]]);
  }));
  return _getMarketsData.apply(this, arguments);
}

var getClientConfig = function getClientConfig() {
  // @ts-ignore
  var networkId = PARA_CONFIG.networkId;
  var clientConfig = {
    '1': {
      augurClient: 'https://api.thegraph.com/subgraphs/name/augurproject/augur-v2-staging',
      blockClient: 'https://api.thegraph.com/subgraphs/name/blocklytics/ethereum-blocks',
      network: 'mainnet'
    },
    '42': {
      augurClient: 'https://api.thegraph.com/subgraphs/name/augurproject/augur-v2-staging',
      blockClient: 'https://api.thegraph.com/subgraphs/name/blocklytics/kovan-blocks',
      network: 'kovan'
    }
  };
  return clientConfig[Number(42)];
};

var paraCashes = {
  '1': {
    networkId: '1',
    Cashes: [{
      name: 'ETH',
      displayDecimals: 4
    }, {
      name: 'USDC',
      displayDecimals: 2
    }],
    network: 'mainnet'
  },
  '42': {
    networkId: '42',
    Cashes: [{
      name: 'ETH',
      displayDecimals: 4
    }, {
      name: 'USDC',
      displayDecimals: 2
    }],
    network: 'kovan'
  }
}; // @ts-ignore

var getCashTokenData = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(cashes) {
    var bulkResults;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return Promise.all( // @ts-ignore
            cashes === null || cashes === void 0 ? void 0 : cashes.map( /*#__PURE__*/function () {
              var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(cash) {
                var _usdPrice$data;

                var usdPrice, tokenData;
                return regeneratorRuntime.wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        _context.next = 2;
                        return client.query({
                          // @ts-ignore
                          query: CASH_TOKEN_DATA,
                          variables: {
                            tokenAddr: cash === null || cash === void 0 ? void 0 : cash.address
                          },
                          fetchPolicy: 'cache-first'
                        });

                      case 2:
                        usdPrice = _context.sent;
                        tokenData = _objectSpread({
                          usdPrice: usdPrice === null || usdPrice === void 0 ? void 0 : (_usdPrice$data = usdPrice.data) === null || _usdPrice$data === void 0 ? void 0 : _usdPrice$data.tokenDayDatas[0]
                        }, cash);

                        if (!tokenData.usdPrice) {
                          // TODO: remove this, used only form kovan testing
                          tokenData = _objectSpread(_objectSpread({}, cash), {}, {
                            usdPrice: (cash === null || cash === void 0 ? void 0 : cash.name) === 'ETH' ? '1300' : '1'
                          });
                        }

                        return _context.abrupt("return", tokenData);

                      case 6:
                      case "end":
                        return _context.stop();
                    }
                  }
                }, _callee);
              }));

              return function (_x3) {
                return _ref2.apply(this, arguments);
              };
            }()));

          case 2:
            bulkResults = _context2.sent;
            return _context2.abrupt("return", (bulkResults || []).reduce(function (p, a) {
              return _objectSpread(_objectSpread({}, p), {}, _defineProperty({}, a.address, a));
            }, {}));

          case 4:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function getCashTokenData(_x2) {
    return _ref.apply(this, arguments);
  };
}(); // /**
//  * @notice Fetches first block after a given timestamp
//  * @dev Query speed is optimized by limiting to a 600-second period
//  * @param {Int} timestamp in seconds
//  */
//   // @ts-ignore


function getBlockFromTimestamp(_x4, _x5) {
  return _getBlockFromTimestamp.apply(this, arguments);
} // //   // @ts-ignore


function _getBlockFromTimestamp() {
  _getBlockFromTimestamp = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(timestamp, url) {
    var _result$data, _result$data$blocks, _result$data$blocks$;

    var result;
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.next = 2;
            return blockClient(url).query({
              query: GET_BLOCK(timestamp)
            });

          case 2:
            result = _context4.sent;
            return _context4.abrupt("return", result ? result === null || result === void 0 ? void 0 : (_result$data = result.data) === null || _result$data === void 0 ? void 0 : (_result$data$blocks = _result$data.blocks) === null || _result$data$blocks === void 0 ? void 0 : (_result$data$blocks$ = _result$data$blocks[0]) === null || _result$data$blocks$ === void 0 ? void 0 : _result$data$blocks$.number : 0);

          case 4:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  }));
  return _getBlockFromTimestamp.apply(this, arguments);
}

function getPastDayBlockNumber(_x6) {
  return _getPastDayBlockNumber.apply(this, arguments);
}

function _getPastDayBlockNumber() {
  _getPastDayBlockNumber = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(blockClient) {
    var utcCurrentTime, utcOneDayBack, block;
    return regeneratorRuntime.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            // @ts-ignore
            utcCurrentTime = _dayjs.default.utc();
            utcOneDayBack = utcCurrentTime.subtract(1, 'day').unix();
            _context5.next = 4;
            return getBlockFromTimestamp(utcOneDayBack, blockClient);

          case 4:
            block = _context5.sent;
            return _context5.abrupt("return", block);

          case 6:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5);
  }));
  return _getPastDayBlockNumber.apply(this, arguments);
}

var ETH = 'ETH';
exports.ETH = ETH;

var getCashesInfo = function getCashesInfo() {
  var networkId = PARA_CONFIG.networkId,
      paraDeploys = PARA_CONFIG.paraDeploys;
  var paraValues = Object.values({
    paraDeploys: paraDeploys
  });
  var keysValues = paraValues.reduce(function (p, v) {
    return _objectSpread(_objectSpread({}, p), {}, _defineProperty({}, v.name, v));
  }, {});
  var cashes = paraCashes[String(42)].Cashes; // fill in address and shareToken

  cashes.forEach(function (c) {
    if (c.name === ETH) {
      var ethPara = keysValues['WETH'];
      if (!ethPara) throw new Error('WETH not found in para deploy configuration');
      c.address = ethPara.addresses.Cash.toLowerCase();
      c.shareToken = ethPara.addresses.ShareToken.toLowerCase();
      c.decimals = ethPara.decimals;
    } else {
      // TODO: will need to be changed, in mainnet deploy this will prob be 'USDC'
      var stablecoinPara = keysValues['USDT'];
      if (!stablecoinPara) throw new Error('USDT/USDC not found in para deploy configuration');
      c.address = stablecoinPara.addresses.Cash.toLowerCase();
      c.shareToken = stablecoinPara.addresses.ShareToken.toLowerCase();
      c.decimals = stablecoinPara.decimals;
    }
  });
  return cashes;
};
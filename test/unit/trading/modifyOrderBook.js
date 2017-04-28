"use strict";

var assert = require("chai").assert;
var augur = new (require("../../../src"))();

describe("modifyOrderBook.addOrder", function () {
  var test = function (t) {
    it(t.description, function () {
      var orderBook = augur.addOrder(t.params.order, t.params.orderBook);
      t.assertions(orderBook);
    });
  };
  test({
    description: "should return the orderBook if no order is defined",
    params: {
      orderBook: {}
    },
    assertions: function (orderBook) {
      assert.deepEqual(orderBook, {});
    }
  });
  test({
    description: "add buy order to empty order book",
    params: {
      order: {
        id: "0x01",
        type: "buy",
        market: "0xa1",
        amount: "3",
        fullPrecisionAmount: "3",
        price: "0.5",
        fullPrecisionPrice: "0.5",
        owner: "0xb0b",
        block: 10,
        outcome: "2"
      },
      orderBook: {}
    },
    assertions: function (orderBook) {
      assert.deepEqual(orderBook, {
        buy: {
          "0x01": {
            id: "0x01",
            type: "buy",
            market: "0xa1",
            amount: "3",
            fullPrecisionAmount: "3",
            price: "0.5",
            fullPrecisionPrice: "0.5",
            owner: "0xb0b",
            block: 10,
            outcome: "2"
          }
        },
        sell: {}
      });
    }
  });
  test({
    description: "add sell order to null order book",
    params: {
      order: {
        id: "0x01",
        type: "sell",
        market: "0xa1",
        amount: "3",
        fullPrecisionAmount: "3",
        price: "0.5",
        fullPrecisionPrice: "0.5",
        owner: "0xb0b",
        block: 10,
        outcome: "2"
      },
      orderBook: null
    },
    assertions: function (orderBook) {
      assert.deepEqual(orderBook, {
        buy: {},
        sell: {
          "0x01": {
            id: "0x01",
            type: "sell",
            market: "0xa1",
            amount: "3",
            fullPrecisionAmount: "3",
            price: "0.5",
            fullPrecisionPrice: "0.5",
            owner: "0xb0b",
            block: 10,
            outcome: "2"
          }
        }
      });
    }
  });
  test({
    description: "add buy order to non-empty order book",
    params: {
      order: {
        id: "0x01",
        type: "buy",
        market: "0xa1",
        amount: "3",
        fullPrecisionAmount: "3",
        price: "0.5",
        fullPrecisionPrice: "0.5",
        owner: "0xb0b",
        block: 10,
        outcome: "2"
      },
      orderBook: {
        buy: {
          "0x02": {
            id: "0x02",
            type: "buy",
            market: "0xa1",
            amount: "1",
            fullPrecisionAmount: "1",
            price: "0.5",
            fullPrecisionPrice: "0.5",
            owner: "0xb0b",
            block: 10,
            outcome: "2"
          }
        }
      }
    },
    assertions: function (orderBook) {
      assert.deepEqual(orderBook, {
        buy: {
          "0x01": {
            id: "0x01",
            type: "buy",
            market: "0xa1",
            amount: "3",
            fullPrecisionAmount: "3",
            price: "0.5",
            fullPrecisionPrice: "0.5",
            owner: "0xb0b",
            block: 10,
            outcome: "2"
          },
          "0x02": {
            id: "0x02",
            type: "buy",
            market: "0xa1",
            amount: "1",
            fullPrecisionAmount: "1",
            price: "0.5",
            fullPrecisionPrice: "0.5",
            owner: "0xb0b",
            block: 10,
            outcome: "2"
          }
        },
        sell: {}
      });
    }
  });
  test({
    description: "add sell order to non-empty order book",
    params: {
      order: {
        id: "0x01",
        type: "sell",
        market: "0xa1",
        amount: "3",
        fullPrecisionAmount: "3",
        price: "0.5",
        fullPrecisionPrice: "0.5",
        owner: "0xb0b",
        block: 10,
        outcome: "2"
      },
      orderBook: {
        buy: {},
        sell: {
          "0x02": {
            id: "0x02",
            type: "sell",
            market: "0xa1",
            amount: "1",
            fullPrecisionAmount: "1",
            price: "0.5",
            fullPrecisionPrice: "0.5",
            owner: "0xb0b",
            block: 10,
            outcome: "2"
          }
        }
      }
    },
    assertions: function (orderBook) {
      assert.deepEqual(orderBook, {
        sell: {
          "0x01": {
            id: "0x01",
            type: "sell",
            market: "0xa1",
            amount: "3",
            fullPrecisionAmount: "3",
            price: "0.5",
            fullPrecisionPrice: "0.5",
            owner: "0xb0b",
            block: 10,
            outcome: "2"
          },
          "0x02": {
            id: "0x02",
            type: "sell",
            market: "0xa1",
            amount: "1",
            fullPrecisionAmount: "1",
            price: "0.5",
            fullPrecisionPrice: "0.5",
            owner: "0xb0b",
            block: 10,
            outcome: "2"
          }
        },
        buy: {}
      });
    }
  });
});

describe("modifyOrderBook.removeOrder", function () {
  var test = function (t) {
    it(t.description, function () {
      var orderBook = augur.removeOrder(t.params.orderID, t.params.orderType, t.params.orderBook);
      t.assertions(orderBook);
    });
  };
  test({
    description: "do nothing if orderBook isn't defined",
    params: {
      orderID: "0x02",
      orderType: "buy",
      orderBook: undefined
    },
    assertions: function (orderBook) {
      assert.isUndefined(orderBook);
    }
  });
  test({
    description: "do nothing if orderType is undefined",
    params: {
      orderID: "0x02",
      orderType: undefined,
      orderBook: {
        buy: {
          "0x01": {
            id: "0x01",
            type: "buy",
            market: "0xa1",
            amount: "3",
            fullPrecisionAmount: "3",
            price: "0.5",
            fullPrecisionPrice: "0.5",
            owner: "0xb0b",
            block: 10,
            outcome: "2"
          }
        },
        sell: {}
      }
    },
    assertions: function (orderBook) {
      assert.deepEqual(orderBook, {
        buy: {
          "0x01": {
            id: "0x01",
            type: "buy",
            market: "0xa1",
            amount: "3",
            fullPrecisionAmount: "3",
            price: "0.5",
            fullPrecisionPrice: "0.5",
            owner: "0xb0b",
            block: 10,
            outcome: "2"
          }
        },
        sell: {}
      });
    }
  });
  test({
    description: "do nothing if orderID is undefined",
    params: {
      orderID: undefined,
      orderType: "buy",
      orderBook: {
        buy: {
          "0x01": {
            id: "0x01",
            type: "buy",
            market: "0xa1",
            amount: "3",
            fullPrecisionAmount: "3",
            price: "0.5",
            fullPrecisionPrice: "0.5",
            owner: "0xb0b",
            block: 10,
            outcome: "2"
          }
        },
        sell: {}
      }
    },
    assertions: function (orderBook) {
      assert.deepEqual(orderBook, {
        buy: {
          "0x01": {
            id: "0x01",
            type: "buy",
            market: "0xa1",
            amount: "3",
            fullPrecisionAmount: "3",
            price: "0.5",
            fullPrecisionPrice: "0.5",
            owner: "0xb0b",
            block: 10,
            outcome: "2"
          }
        },
        sell: {}
      });
    }
  });
  test({
    description: "do nothing if order ID not in order book",
    params: {
      orderID: "0x02",
      orderType: "buy",
      orderBook: {
        buy: {
          "0x01": {
            id: "0x01",
            type: "buy",
            market: "0xa1",
            amount: "3",
            fullPrecisionAmount: "3",
            price: "0.5",
            fullPrecisionPrice: "0.5",
            owner: "0xb0b",
            block: 10,
            outcome: "2"
          }
        },
        sell: {}
      }
    },
    assertions: function (orderBook) {
      assert.deepEqual(orderBook, {
        buy: {
          "0x01": {
            id: "0x01",
            type: "buy",
            market: "0xa1",
            amount: "3",
            fullPrecisionAmount: "3",
            price: "0.5",
            fullPrecisionPrice: "0.5",
            owner: "0xb0b",
            block: 10,
            outcome: "2"
          }
        },
        sell: {}
      });
    }
  });
  test({
    description: "remove last buy order from order book",
    params: {
      orderID: "0x01",
      orderType: "buy",
      orderBook: {
        buy: {
          "0x01": {
            id: "0x01",
            type: "buy",
            market: "0xa1",
            amount: "3",
            fullPrecisionAmount: "3",
            price: "0.5",
            fullPrecisionPrice: "0.5",
            owner: "0xb0b",
            block: 10,
            outcome: "2"
          }
        },
        sell: {}
      }
    },
    assertions: function (orderBook) {
      assert.deepEqual(orderBook, {
        buy: {},
        sell: {}
      });
    }
  });
  test({
    description: "remove buy order from order book",
    params: {
      orderID: "0x01",
      orderType: "buy",
      orderBook: {
        buy: {
          "0x01": {
            id: "0x01",
            type: "buy",
            market: "0xa1",
            amount: "3",
            fullPrecisionAmount: "3",
            price: "0.5",
            fullPrecisionPrice: "0.5",
            owner: "0xb0b",
            block: 10,
            outcome: "2"
          },
          "0x02": {
            id: "0x02",
            type: "buy",
            market: "0xa1",
            amount: "1",
            fullPrecisionAmount: "1",
            price: "0.5",
            fullPrecisionPrice: "0.5",
            owner: "0xb0b",
            block: 10,
            outcome: "2"
          }
        },
        sell: {}
      }
    },
    assertions: function (orderBook) {
      assert.deepEqual(orderBook, {
        buy: {
          "0x02": {
            id: "0x02",
            type: "buy",
            market: "0xa1",
            amount: "1",
            fullPrecisionAmount: "1",
            price: "0.5",
            fullPrecisionPrice: "0.5",
            owner: "0xb0b",
            block: 10,
            outcome: "2"
          }
        },
        sell: {}
      });
    }
  });
  test({
    description: "remove sell order from order book",
    params: {
      orderID: "0x01",
      orderType: "sell",
      orderBook: {
        sell: {
          "0x01": {
            id: "0x01",
            type: "sell",
            market: "0xa1",
            amount: "3",
            fullPrecisionAmount: "3",
            price: "0.5",
            fullPrecisionPrice: "0.5",
            owner: "0xb0b",
            block: 10,
            outcome: "2"
          },
          "0x02": {
            id: "0x02",
            type: "sell",
            market: "0xa1",
            amount: "1",
            fullPrecisionAmount: "1",
            price: "0.5",
            fullPrecisionPrice: "0.5",
            owner: "0xb0b",
            block: 10,
            outcome: "2"
          }
        },
        buy: {}
      }
    },
    assertions: function (orderBook) {
      assert.deepEqual(orderBook, {
        sell: {
          "0x02": {
            id: "0x02",
            type: "sell",
            market: "0xa1",
            amount: "1",
            fullPrecisionAmount: "1",
            price: "0.5",
            fullPrecisionPrice: "0.5",
            owner: "0xb0b",
            block: 10,
            outcome: "2"
          }
        },
        buy: {}
      });
    }
  });
});

describe("modifyOrderBook.fillOrder", function () {
  var test = function (t) {
    it(t.description, function () {
      var orderBook = augur.fillOrder(t.params.orderID, t.params.amount, t.params.filledOrderType, t.params.orderBook);
      t.assertions(orderBook);
    });
  };
  test({
    description: "do nothing if filledOrderType is undefined",
    params: {
      orderID: "0x02",
      amount: "1",
      filledOrderType: undefined,
      orderBook: {
        buy: {
          "0x01": {
            id: "0x01",
            type: "buy",
            market: "0xa1",
            amount: "3",
            fullPrecisionAmount: "3",
            price: "0.5",
            fullPrecisionPrice: "0.5",
            owner: "0xb0b",
            block: 10,
            outcome: "2"
          }
        },
        sell: {}
      }
    },
    assertions: function (orderBook) {
      assert.deepEqual(orderBook, {
        buy: {
          "0x01": {
            id: "0x01",
            type: "buy",
            market: "0xa1",
            amount: "3",
            fullPrecisionAmount: "3",
            price: "0.5",
            fullPrecisionPrice: "0.5",
            owner: "0xb0b",
            block: 10,
            outcome: "2"
          }
        },
        sell: {}
      });
    }
  });
  test({
    description: "do nothing if amount is undefined",
    params: {
      orderID: "0x02",
      amount: undefined,
      filledOrderType: "buy",
      orderBook: {
        buy: {
          "0x01": {
            id: "0x01",
            type: "buy",
            market: "0xa1",
            amount: "3",
            fullPrecisionAmount: "3",
            price: "0.5",
            fullPrecisionPrice: "0.5",
            owner: "0xb0b",
            block: 10,
            outcome: "2"
          }
        },
        sell: {}
      }
    },
    assertions: function (orderBook) {
      assert.deepEqual(orderBook, {
        buy: {
          "0x01": {
            id: "0x01",
            type: "buy",
            market: "0xa1",
            amount: "3",
            fullPrecisionAmount: "3",
            price: "0.5",
            fullPrecisionPrice: "0.5",
            owner: "0xb0b",
            block: 10,
            outcome: "2"
          }
        },
        sell: {}
      });
    }
  });
  test({
    description: "do nothing if orderBook is undefined",
    params: {
      orderID: "0x02",
      amount: "1",
      filledOrderType: "buy",
      orderBook: undefined
    },
    assertions: function (orderBook) {
      assert.isUndefined(orderBook);
    }
  });
  test({
    description: "do nothing if orderID is undefined",
    params: {
      orderID: undefined,
      amount: "1",
      filledOrderType: "buy",
      orderBook: {
        buy: {
          "0x01": {
            id: "0x01",
            type: "buy",
            market: "0xa1",
            amount: "3",
            fullPrecisionAmount: "3",
            price: "0.5",
            fullPrecisionPrice: "0.5",
            owner: "0xb0b",
            block: 10,
            outcome: "2"
          }
        },
        sell: {}
      }
    },
    assertions: function (orderBook) {
      assert.deepEqual(orderBook, {
        buy: {
          "0x01": {
            id: "0x01",
            type: "buy",
            market: "0xa1",
            amount: "3",
            fullPrecisionAmount: "3",
            price: "0.5",
            fullPrecisionPrice: "0.5",
            owner: "0xb0b",
            block: 10,
            outcome: "2"
          }
        },
        sell: {}
      });
    }
  });
  test({
    description: "do nothing if order ID not in order book",
    params: {
      orderID: "0x02",
      amount: "1",
      filledOrderType: "buy",
      orderBook: {
        buy: {
          "0x01": {
            id: "0x01",
            type: "buy",
            market: "0xa1",
            amount: "3",
            fullPrecisionAmount: "3",
            price: "0.5",
            fullPrecisionPrice: "0.5",
            owner: "0xb0b",
            block: 10,
            outcome: "2"
          }
        },
        sell: {}
      }
    },
    assertions: function (orderBook) {
      assert.deepEqual(orderBook, {
        buy: {
          "0x01": {
            id: "0x01",
            type: "buy",
            market: "0xa1",
            amount: "3",
            fullPrecisionAmount: "3",
            price: "0.5",
            fullPrecisionPrice: "0.5",
            owner: "0xb0b",
            block: 10,
            outcome: "2"
          }
        },
        sell: {}
      });
    }
  });
  test({
    description: "partially fill a buy order",
    params: {
      orderID: "0x01",
      amount: "1",
      filledOrderType: "buy",
      orderBook: {
        buy: {
          "0x01": {
            id: "0x01",
            type: "buy",
            market: "0xa1",
            amount: "3",
            fullPrecisionAmount: "3",
            price: "0.5",
            fullPrecisionPrice: "0.5",
            owner: "0xb0b",
            block: 10,
            outcome: "2"
          },
          "0x02": {
            id: "0x02",
            type: "buy",
            market: "0xa1",
            amount: "1",
            fullPrecisionAmount: "1",
            price: "0.5",
            fullPrecisionPrice: "0.5",
            owner: "0xb0b",
            block: 10,
            outcome: "2"
          }
        },
        sell: {}
      }
    },
    assertions: function (orderBook) {
      assert.deepEqual(orderBook, {
        buy: {
          "0x01": {
            id: "0x01",
            type: "buy",
            market: "0xa1",
            amount: "2",
            fullPrecisionAmount: "2",
            price: "0.5",
            fullPrecisionPrice: "0.5",
            owner: "0xb0b",
            block: 10,
            outcome: "2"
          },
          "0x02": {
            id: "0x02",
            type: "buy",
            market: "0xa1",
            amount: "1",
            fullPrecisionAmount: "1",
            price: "0.5",
            fullPrecisionPrice: "0.5",
            owner: "0xb0b",
            block: 10,
            outcome: "2"
          }
        },
        sell: {}
      });
    }
  });
  test({
    description: "fill entire buy order and remove it from order book",
    params: {
      orderID: "0x01",
      amount: "3",
      filledOrderType: "buy",
      orderBook: {
        buy: {
          "0x01": {
            id: "0x01",
            type: "buy",
            market: "0xa1",
            amount: "3",
            fullPrecisionAmount: "3",
            price: "0.5",
            fullPrecisionPrice: "0.5",
            owner: "0xb0b",
            block: 10,
            outcome: "2"
          },
          "0x02": {
            id: "0x02",
            type: "buy",
            market: "0xa1",
            amount: "1",
            fullPrecisionAmount: "1",
            price: "0.5",
            fullPrecisionPrice: "0.5",
            owner: "0xb0b",
            block: 10,
            outcome: "2"
          }
        },
        sell: {}
      }
    },
    assertions: function (orderBook) {
      assert.deepEqual(orderBook, {
        buy: {
          "0x02": {
            id: "0x02",
            type: "buy",
            market: "0xa1",
            amount: "1",
            fullPrecisionAmount: "1",
            price: "0.5",
            fullPrecisionPrice: "0.5",
            owner: "0xb0b",
            block: 10,
            outcome: "2"
          }
        },
        sell: {}
      });
    }
  });
  test({
    description: "partially fill a sell order",
    params: {
      orderID: "0x01",
      amount: "1",
      filledOrderType: "sell",
      orderBook: {
        sell: {
          "0x01": {
            id: "0x01",
            type: "sell",
            market: "0xa1",
            amount: "3",
            fullPrecisionAmount: "3",
            price: "0.5",
            fullPrecisionPrice: "0.5",
            owner: "0xb0b",
            block: 10,
            outcome: "2"
          },
          "0x02": {
            id: "0x02",
            type: "sell",
            market: "0xa1",
            amount: "1",
            fullPrecisionAmount: "1",
            price: "0.5",
            fullPrecisionPrice: "0.5",
            owner: "0xb0b",
            block: 10,
            outcome: "2"
          }
        },
        buy: {}
      }
    },
    assertions: function (orderBook) {
      assert.deepEqual(orderBook, {
        sell: {
          "0x01": {
            id: "0x01",
            type: "sell",
            market: "0xa1",
            amount: "2",
            fullPrecisionAmount: "2",
            price: "0.5",
            fullPrecisionPrice: "0.5",
            owner: "0xb0b",
            block: 10,
            outcome: "2"
          },
          "0x02": {
            id: "0x02",
            type: "sell",
            market: "0xa1",
            amount: "1",
            fullPrecisionAmount: "1",
            price: "0.5",
            fullPrecisionPrice: "0.5",
            owner: "0xb0b",
            block: 10,
            outcome: "2"
          }
        },
        buy: {}
      });
    }
  });
  test({
    description: "fill entire sell order and remove it from order book",
    params: {
      orderID: "0x01",
      amount: "3",
      filledOrderType: "sell",
      orderBook: {
        sell: {
          "0x01": {
            id: "0x01",
            type: "sell",
            market: "0xa1",
            amount: "3",
            fullPrecisionAmount: "3",
            price: "0.5",
            fullPrecisionPrice: "0.5",
            owner: "0xb0b",
            block: 10,
            outcome: "2"
          },
          "0x02": {
            id: "0x02",
            type: "sell",
            market: "0xa1",
            amount: "1",
            fullPrecisionAmount: "1",
            price: "0.5",
            fullPrecisionPrice: "0.5",
            owner: "0xb0b",
            block: 10,
            outcome: "2"
          }
        },
        buy: {}
      }
    },
    assertions: function (orderBook) {
      assert.deepEqual(orderBook, {
        sell: {
          "0x02": {
            id: "0x02",
            type: "sell",
            market: "0xa1",
            amount: "1",
            fullPrecisionAmount: "1",
            price: "0.5",
            fullPrecisionPrice: "0.5",
            owner: "0xb0b",
            block: 10,
            outcome: "2"
          }
        },
        buy: {}
      });
    }
  });
});

describe("modifyOrderBook.adjustScalarOrder", function () {
  var test = function (t) {
    it(t.description, function () {
      t.assertions(augur.adjustScalarOrder(t.params.order, t.params.minValue));
    });
  };
  test({
    description: "Should handle adjusting an order passed with just a price",
    params: {
      order: { price: "25" },
      minValue: "10"
    },
    assertions: function (o) {
      assert.deepEqual(o, { price: "35", fullPrecisionPrice: "35" });
    }
  });
  test({
    description: "Should handle adjusting an order passed with a price and fullPrecisionPrice",
    params: {
      order: { price: "15", fullPrecisionPrice: "30" },
      minValue: "-5"
    },
    assertions: function (o) {
      assert.deepEqual(o, { price: "10", fullPrecisionPrice: "25" });
    }
  });
});

describe("modifyOrderBook.convertAddTxLogToOrder", function () {
  var test = function (t) {
    it(t.description, function () {
      var order = augur.convertAddTxLogToOrder(t.params.log, t.params.marketType, t.params.minValue);
      t.assertions(order);
    });
  };
  test({
    description: "convert non-scalar buy log_add_tx to order",
    params: {
      log: {
        tradeid: "0x01",
        type: "buy",
        market: "0xa1",
        amount: "2",
        price: "0.4",
        sender: "0xb0b",
        blockNumber: 10,
        outcome: "2"
      },
      marketType: "binary",
      minValue: null
    },
    assertions: function (order) {
      assert.deepEqual(order, {
        id: "0x01",
        type: "buy",
        market: "0xa1",
        amount: "2",
        fullPrecisionAmount: "2",
        price: "0.4",
        fullPrecisionPrice: "0.4",
        owner: "0xb0b",
        block: 10,
        outcome: "2"
      });
    }
  });
  test({
    description: "convert non-scalar sell log_add_tx to order",
    params: {
      log: {
        tradeid: "0x01",
        type: "sell",
        market: "0xa1",
        amount: "2",
        price: "0.4",
        sender: "0xb0b",
        blockNumber: 10,
        outcome: "2"
      },
      marketType: "binary",
      minValue: null
    },
    assertions: function (order) {
      assert.deepEqual(order, {
        id: "0x01",
        type: "sell",
        market: "0xa1",
        amount: "2",
        fullPrecisionAmount: "2",
        price: "0.4",
        fullPrecisionPrice: "0.4",
        owner: "0xb0b",
        block: 10,
        outcome: "2"
      });
    }
  });
  test({
    description: "convert non-scalar buy log_add_tx to order (amount rounded off)",
    params: {
      log: {
        tradeid: "0x01",
        type: "buy",
        market: "0xa1",
        amount: "2.3456789",
        price: "0.4",
        sender: "0xb0b",
        blockNumber: 10,
        outcome: "2"
      },
      marketType: "binary",
      minValue: null
    },
    assertions: function (order) {
      assert.deepEqual(order, {
        id: "0x01",
        type: "buy",
        market: "0xa1",
        amount: "2.3456",
        fullPrecisionAmount: "2.3456789",
        price: "0.4",
        fullPrecisionPrice: "0.4",
        owner: "0xb0b",
        block: 10,
        outcome: "2"
      });
    }
  });
  test({
    description: "convert non-scalar buy log_add_tx to order (amount and price rounded off)",
    params: {
      log: {
        tradeid: "0x01",
        type: "buy",
        market: "0xa1",
        amount: "2.3456789",
        price: "0.123456789",
        sender: "0xb0b",
        blockNumber: 10,
        outcome: "2"
      },
      marketType: "binary",
      minValue: null
    },
    assertions: function (order) {
      assert.deepEqual(order, {
        id: "0x01",
        type: "buy",
        market: "0xa1",
        amount: "2.3456",
        fullPrecisionAmount: "2.3456789",
        price: "0.1234",
        fullPrecisionPrice: "0.123456789",
        owner: "0xb0b",
        block: 10,
        outcome: "2"
      });
    }
  });
  test({
    description: "convert scalar buy log_add_tx to order",
    params: {
      log: {
        tradeid: "0x02",
        type: "buy",
        market: "0xa2",
        amount: "2",
        price: "0.456789",
        sender: "0xb0b",
        blockNumber: 10,
        outcome: "2"
      },
      marketType: "scalar",
      minValue: "-5"
    },
    assertions: function (order) {
      assert.deepEqual(order, {
        id: "0x02",
        type: "buy",
        market: "0xa2",
        amount: "2",
        fullPrecisionAmount: "2",
        price: "-4.5433",
        fullPrecisionPrice: "-4.543211",
        owner: "0xb0b",
        block: 10,
        outcome: "2"
      });
    }
  });
  test({
    description: "convert scalar sell log_add_tx to order",
    params: {
      log: {
        tradeid: "0x02",
        type: "sell",
        market: "0xa2",
        amount: "2",
        price: "0.456789",
        sender: "0xb0b",
        blockNumber: 10,
        outcome: "2"
      },
      marketType: "scalar",
      minValue: "-5"
    },
    assertions: function (order) {
      assert.deepEqual(order, {
        id: "0x02",
        type: "sell",
        market: "0xa2",
        amount: "2",
        fullPrecisionAmount: "2",
        price: "-4.5432",
        fullPrecisionPrice: "-4.543211",
        owner: "0xb0b",
        block: 10,
        outcome: "2"
      });
    }
  });
});

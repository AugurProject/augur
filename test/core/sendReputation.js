/**
 * augur.js tests
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var runner = require("../runner");

describe("Unit tests", function () {
    runner("eth_sendTransaction", "SendReputation", [{
        method: "sendReputation",
        parameters: ["hash", "address", "fixed"]
    }]);
});

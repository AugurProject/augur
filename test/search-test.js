/**
 * augur unit tests
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var test = require("tape");
var constants = require("../app/libs/constants");
var flux = require("./mock");

flux.augur.connect();

// test("SearchActions.updateKeywords", function (t) {
//     flux.actions.search.updateKeywords(keywords);
//     t.end();
// });

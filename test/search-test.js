/**
 * augur unit tests
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var test = require("tape");
var augur = require("augur.js");
var constants = require("../app/libs/constants");
var flux = require("./mock");

augur.connect(process.env.AUGUR_HOST);

// test("SearchActions.updateKeywords", function (t) {
//     flux.actions.search.updateKeywords(keywords);
//     t.end();
// });

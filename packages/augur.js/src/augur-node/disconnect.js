"use strict";

var augurNodeState = require("./state");

function disconnect() {
  if (augurNodeState.getTransport() !== null) augurNodeState.getTransport().close();
}


module.exports = disconnect;


var uuid = require("uuid");
var uuidParse = require("uuid-parse");
var speedomatic = require("speedomatic");

export function generateTradeGroupId() {
  return speedomatic.formatInt256(Buffer.from(uuidParse.parse(uuid.v4())).toString("hex"));
}

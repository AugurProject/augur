import * as uuid from "uuid";
import * as uuidParse from "uuid-parse";
import * as speedomatic from "speedomatic";

export function generateTradeGroupId() {
  return speedomatic.formatInt256(Buffer.from(uuidParse.parse(uuid.v4())).toString("hex"));
}

import { HTTPConnector } from "./http-connector";
import { Markets } from "../state/api/Markets"

(async function() {
  const connector = new HTTPConnector("http://localhost:9003");
  console.log(await connector.invoke(Markets.getMarkets, {
    universe: "0x6a424C1bd008C82191Db24bA1528e60ca92314cA"
  }));
})().then(() => {}).catch(console.log)

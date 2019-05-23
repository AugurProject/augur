import * as HTTPEndpoint from "@augurproject/sdk/build/state/HTTPEndpoint";
import request from "supertest";
import { API } from "@augurproject/sdk/build/state/api/API";
import { Augur } from "@augurproject/sdk";
import { DB } from "@augurproject/sdk/build/state/db/DB";
import { makeTestAugur, ACCOUNTS, makeDbMock } from "../../libs";

const mock = makeDbMock();

beforeEach(async () => {
  await mock.wipeDB();
});

let augur: Augur;
let db: DB;

beforeAll(async () => {
  augur = await makeTestAugur(ACCOUNTS);
  db = await mock.makeDB(augur, ACCOUNTS);
}, 120000);

test("HTTPEndpoint :: Responds to ping Json RPC Request ", async () => {
  const api = new API(augur, db);
  const app = HTTPEndpoint.createApp(api);  // fire up the endpoint

  const result = await request(app).post("/").send({
    jsonrpc: "2.0",
    method: "ping",
    params: {},
    id: 74,
  }).set("Accept", "application/json");

  expect(result.text).toEqual('{"id":74,"result":{"response":"pong"},"jsonrpc":"2.0"}');
  expect(result.status).toEqual(200);
});

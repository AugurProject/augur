import { Augur } from '@augurproject/sdk';
import { DB } from '@augurproject/sdk/build/state/db/DB';
import { API } from '@augurproject/sdk/build/state/getter/API';
import * as HTTPEndpoint from '@augurproject/sdk/build/state/HTTPEndpoint';
import { ACCOUNTS, defaultSeedPath, loadSeedFile } from '@augurproject/tools';
import request from 'supertest';
import { makeDbMock, makeTestAugur } from '../../libs';

const mock = makeDbMock();

beforeEach(async () => {
  await mock.wipeDB();
});

let augur: Augur;
let db: Promise<DB>;

beforeAll(async () => {
  const seed = await loadSeedFile(defaultSeedPath);
  augur = await makeTestAugur(seed, ACCOUNTS);
  db = mock.makeDB(augur, ACCOUNTS);
  // Must wait for the db for initialize before we start the http server.
  await db;
});

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

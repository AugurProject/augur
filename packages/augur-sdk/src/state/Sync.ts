import { API } from "./getter/API";
import { create } from "./create-api";
import DatabaseConfiguration = PouchDB.Configuration.DatabaseConfiguration;

export async function start(ethNodeUrl: string, account?: string, dbArgs: DatabaseConfiguration = {}): Promise<API> {
  console.log("xXXXX OOOOOOOOOOOOOO");
  const { api, controller } = await create(ethNodeUrl, account, dbArgs);

  await controller.run();

  return api;
}

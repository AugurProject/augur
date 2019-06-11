import { API } from "./getter/API";
import { create } from "./index";
import DatabaseConfiguration = PouchDB.Configuration.DatabaseConfiguration;

export async function start(ethNodeUrl: string, account?: string, dbArgs: DatabaseConfiguration = {}): Promise<API> {
  const { api, controller } = await create(ethNodeUrl, account, dbArgs);
  await controller.run();

  return api;
}

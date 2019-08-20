import { API } from "./getter/API";
import { create } from "./create-api";
import DatabaseConfiguration = PouchDB.Configuration.DatabaseConfiguration;

export async function start(ethNodeUrl: string, account?: string, dbArgs: DatabaseConfiguration = {}, enableFlexSearch = false): Promise<API> {
  const { api, controller } = await create(ethNodeUrl, account, dbArgs, enableFlexSearch);

  await controller.run();

  return api;
}

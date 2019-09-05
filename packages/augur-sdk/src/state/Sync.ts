import { API } from "./getter/API";
import { create } from "./create-api";
import DatabaseConfiguration = PouchDB.Configuration.DatabaseConfiguration;

// @TODO This function is currently a hack. Need to come up with a better solution
export async function createAPIAndController(ethNodeUrl: string, account?: string, dbArgs: DatabaseConfiguration = {}, enableFlexSearch = false) {
  return create(ethNodeUrl, account, dbArgs, enableFlexSearch);
}

export async function start(ethNodeUrl: string, account?: string, dbArgs: DatabaseConfiguration = {}, enableFlexSearch = false): Promise<API> {
  const { api, controller } = await create(ethNodeUrl, account, dbArgs, enableFlexSearch);

  await controller.run();

  return api;
}

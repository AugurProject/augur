import { API } from './getter/API';
import { create } from './create-api';

import PouchDB from 'pouchdb';
export type DatabaseConfiguration = PouchDB.Configuration.DatabaseConfiguration;

// @TODO This function is currently a hack. Need to come up with a better solution
export async function createAPIAndController(ethNodeUrl: string, account?: string, enableFlexSearch = false, databaseConfiguration:DatabaseConfiguration = {}) {
  return create(ethNodeUrl, account, enableFlexSearch, databaseConfiguration);
}

export async function start(ethNodeUrl: string, account?: string, enableFlexSearch = false, databaseConfiguration:DatabaseConfiguration ={}): Promise<API> {
  const { api, controller } = await create(ethNodeUrl, account, enableFlexSearch, databaseConfiguration);

  await controller.run();

  return api;
}

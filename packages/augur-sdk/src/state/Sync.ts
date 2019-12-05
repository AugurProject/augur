import { API } from './getter/API';
import { create } from './create-api';

// @TODO This function is currently a hack. Need to come up with a better solution
export async function createAPIAndController(ethNodeUrl: string, account?: string, enableFlexSearch = false) {
  return create(ethNodeUrl, account, enableFlexSearch);
}

export async function start(ethNodeUrl: string, account?: string, enableFlexSearch = false): Promise<API> {
  const { api, controller } = await create(ethNodeUrl, account, enableFlexSearch);

  await controller.run();

  return api;
}

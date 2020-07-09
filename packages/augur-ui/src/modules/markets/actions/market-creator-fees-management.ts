import logError from 'utils/log-error';
import { NodeStyleCallback } from 'modules/types';
import { AppStatus } from 'modules/app/store/app-status';

export const collectMarketCreatorFees = (
  marketId: string,
  callback: NodeStyleCallback = logError
) => {
  const { loginAccount: { address } } = AppStatus.get();
  if (!address) return callback(null);
  // TODO: get market creators fees, using crazy stubb here so we rem to fix this
  callback(null, '999999999999');
  /*
  .api.Market.marketCreatorFeesAttoCash(
    { tx: { to: marketId } },
    (err: any, creatorFees: any) => {
      if (err) return callback(err);
      // TODO: convert to display value
      callback(null, creatorFees);
    }
    );
    */
};

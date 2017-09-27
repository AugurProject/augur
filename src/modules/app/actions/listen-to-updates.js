import BigNumber from 'bignumber.js';
import { augur } from 'services/augurjs';
import { updateAssets } from 'modules/auth/actions/update-assets';
import { syncBlockchain } from 'modules/app/actions/sync-blockchain';
import syncBranch from 'modules/branch/actions/sync-branch';
import { fillOrder } from 'modules/bids-asks/actions/update-order-book';
import { loadMarketsInfo } from 'modules/markets/actions/load-markets-info';
import { updateOutcomePrice } from 'modules/markets/actions/update-outcome-price';
import claimProceeds from 'modules/my-positions/actions/claim-proceeds';
import { convertLogsToTransactions } from 'modules/transactions/actions/convert-logs-to-transactions';
import { updateMarketTopicPopularity } from 'modules/topics/actions/update-topics';
import * as TYPES from 'modules/transactions/constants/types';
import { updateAccountBidsAsksData, updateAccountCancelsData, updateAccountTradesData } from 'modules/my-positions/actions/update-account-trades-data';

export function listenToUpdates() {
  return (dispatch, getState) => {
    augur.filters.startListeners({

      // block arrivals
      block: (blockHash) => {
        dispatch(syncBlockchain());
        dispatch(updateAssets());
        dispatch(syncBranch());
      },

      Branch: {
        // new market: msg = { marketID }
        CreateMarket: (msg) => {
          if (msg && msg.marketID) {
            console.log('CreateMarket:', msg);
            dispatch(loadMarketsInfo([msg.marketID]));
            if (msg.sender === getState().loginAccount.address) {
              dispatch(updateAssets());
              dispatch(convertLogsToTransactions(TYPES.CREATE_MARKET, [msg]));
            }
          }
        }
      },

      Cash: {
        Approval: (msg) => {
          if (msg) {
            console.log('Approval:', msg);
            const { address } = getState().loginAccount;
            if (msg._owner === address || msg._spender === address) {
              dispatch(updateAssets());
              dispatch(convertLogsToTransactions(TYPES.APPROVAL, [msg]));
            }
          }
        },
        DepositEther: (msg) => {
          if (msg && msg.sender === getState().loginAccount.address) {
            console.log('DepositEther:', msg);
            dispatch(updateAssets());
            dispatch(convertLogsToTransactions(TYPES.DEPOSIT_ETHER, [msg]));
          }
        },
        Transfer: (msg) => {
          if (msg) {
            console.log('Transfer:', msg);
            const { address } = getState().loginAccount;
            if (msg._from === address || msg._to === address) {
              dispatch(updateAssets());
              dispatch(convertLogsToTransactions(TYPES.TRANSFER, [msg]));
            }
          }
        },
        WithdrawEther: (msg) => {
          if (msg && msg.sender === getState().loginAccount.address) {
            console.log('WithdrawEther:', msg);
            dispatch(updateAssets());
            dispatch(convertLogsToTransactions(TYPES.WITHDRAW_ETHER, [msg]));
          }
        }
      },

      ClaimProceeds: {
        Payout: (msg) => {
          if (msg && msg.sender === getState().loginAccount.address) {
            console.log('Payout:', msg);
            dispatch(updateAssets());
            dispatch(convertLogsToTransactions(TYPES.PAYOUT, [msg]));
          }
        }
      },

      Orders: {
        // order removed from orderbook
        CancelOrder: (msg) => {
          console.log('CancelOrder:', msg);
          if (msg && msg.market && msg.outcome != null) {
            // if this is the user's order, then add it to the transaction display
            if (msg.sender === getState().loginAccount.address) {
              dispatch(updateAccountCancelsData({
                [msg.market]: { [msg.outcome]: [msg] }
              }));
              dispatch(updateAssets());
            }
          }
        },
        // order added to orderbook
        MakeOrder: (msg) => {
          console.log('MakeOrder:', msg);
          if (msg && msg.market && msg.outcome != null) {

            // if this is the user's order, then add it to the transaction display
            if (msg.sender === getState().loginAccount.address) {
              dispatch(updateAccountBidsAsksData({
                [msg.market]: {
                  [msg.outcome]: [msg]
                }
              }));
              dispatch(updateAssets());
            }
          }
        },
        // trade filled: { market, outcome (id), price }
        TakeOrder: (msg) => {
          console.log('TakeOrder:', msg);
          if (msg && msg.market && msg.price && msg.outcome != null) {
            dispatch(updateOutcomePrice(msg.market, msg.outcome, new BigNumber(msg.price, 10)));
            dispatch(updateMarketTopicPopularity(msg.market, msg.amount));
            const { address } = getState().loginAccount;
            if (msg.sender !== address) dispatch(fillOrder(msg));
            if (msg.sender === address || msg.owner === address) {
              dispatch(updateAccountTradesData({
                [msg.market]: { [msg.outcome]: [{
                  ...msg,
                  maker: msg.owner === address
                }] }
              }));
              dispatch(updateAssets());
              dispatch(loadMarketsInfo([msg.market]));
              console.log('MSG -- ', msg);
            }
          }
        }
      },

      Market: {
        Finalize: (msg) => {
          if (msg && msg.market) {
            console.log('Finalize:', msg);
            const { branch, loginAccount } = getState();
            if (branch.id === msg.branch) {
              dispatch(loadMarketsInfo([msg.market], () => {
                const { volume } = getState().marketsData[msg.market];
                dispatch(updateMarketTopicPopularity(msg.market, new BigNumber(volume, 10).neg().toNumber()));
                if (loginAccount.address) dispatch(claimProceeds());
              }));
            }
          }
        }
      },

      Registration: {
        Registration: (msg) => {
          if (msg && msg.sender === getState().loginAccount.address) {
            console.log('Registration:', msg);
            dispatch(convertLogsToTransactions(TYPES.REGISTRATION, [msg]));
          }
        }
      },

      ReportingToken: {
        RedeemWinningTokens: (msg) => {
          if (msg && msg.reporter === getState().loginAccount.address) {
            console.log('RedeemWinningTokens:', msg);
            dispatch(updateAssets());
            dispatch(convertLogsToTransactions(TYPES.REDEEM_WINNING_TOKENS, [msg]));
          }
        },
        SubmitReport: (msg) => {
          if (msg && msg.sender === getState().loginAccount.address) {
            console.log('SubmitReport:', msg);
            dispatch(updateAssets());
            dispatch(convertLogsToTransactions(TYPES.SUBMIT_REPORT, [msg]));
          }
        }
      },

      ReputationToken: {
        Approval: (msg) => {
          if (msg) {
            console.log('Approval:', msg);
            const { address } = getState().loginAccount;
            if (msg._owner === address || msg._spender === address) {
              dispatch(updateAssets());
              dispatch(convertLogsToTransactions(TYPES.APPROVAL, [msg]));
            }
          }
        },
        Transfer: (msg) => {
          if (msg) {
            console.log('Transfer:', msg);
            const { address } = getState().loginAccount;
            if (msg._from === address || msg._to === address) {
              dispatch(updateAssets());
              dispatch(convertLogsToTransactions(TYPES.TRANSFER, [msg]));
            }
          }
        }
      }
    }, () => console.log('Listening for events'));
  };
}

import BigNumber from 'bignumber.js';
import { augur, abi } from 'services/augurjs';
import { updateAssets } from 'modules/auth/actions/update-assets';
import { syncBlockchain } from 'modules/app/actions/sync-blockchain';
import { syncBranch } from 'modules/branch/actions/sync-branch';
import { fillOrder } from 'modules/bids-asks/actions/update-market-order-book';
import { loadMarketsInfo } from 'modules/markets/actions/load-markets-info';
import { updateOutcomePrice } from 'modules/markets/actions/update-outcome-price';
import { claimProceeds } from 'modules/my-positions/actions/claim-proceeds';
import { convertLogsToTransactions } from 'modules/transactions/actions/convert-logs-to-transactions';
import { updateMarketTopicPopularity } from 'modules/topics/actions/update-topics';
import * as TYPES from 'modules/transactions/constants/types';
import { updateAccountBidsAsksData, updateAccountCancelsData, updateAccountTradesData } from 'modules/my-positions/actions/update-account-trades-data';

export function listenToUpdates() {
  return (dispatch, getState) => {
    const { contractAddresses, eventsAPI } = getState();
    augur.filters.listen(contractAddresses, eventsAPI, {

      // block arrivals
      block: (blockHash) => {
        dispatch(syncBlockchain());
        dispatch(updateAssets());
        dispatch(syncBranch());
      },

      collectedFees: (msg) => {
        if (msg && msg.sender === getState().loginAccount.address) {
          console.log('collectedFees:', msg);
          dispatch(updateAssets());
          dispatch(convertLogsToTransactions(TYPES.COLLECTED_FEES, [msg]));
        }
      },

      payout: (msg) => {
        if (msg && msg.sender === getState().loginAccount.address) {
          console.log('payout:', msg);
          dispatch(updateAssets());
          dispatch(convertLogsToTransactions(TYPES.PAYOUT, [msg]));
        }
      },

      penalizationCaughtUp: (msg) => {
        if (msg && msg.sender === getState().loginAccount.address) {
          console.log('penalizationCaughtUp:', msg);
          dispatch(updateAssets());
          dispatch(convertLogsToTransactions(TYPES.PENALIZATION_CAUGHT_UP, [msg]));
        }
      },

      // Reporter penalization
      penalize: (msg) => {
        if (msg && msg.sender === getState().loginAccount.address) {
          console.log('penalize:', msg);
          dispatch(updateAssets());
          dispatch(convertLogsToTransactions(TYPES.PENALIZE, [msg]));
        }
      },

      registration: (msg) => {
        if (msg && msg.sender === getState().loginAccount.address) {
          console.log('registration:', msg);
          dispatch(convertLogsToTransactions(TYPES.REGISTRATION, [msg]));
        }
      },

      submittedReport: (msg) => {
        if (msg && msg.sender === getState().loginAccount.address) {
          console.log('submittedReport:', msg);
          dispatch(updateAssets());
          dispatch(convertLogsToTransactions(TYPES.SUBMITTED_REPORT, [msg]));
        }
      },

      submittedReportHash: (msg) => {
        if (msg && msg.sender === getState().loginAccount.address) {
          console.log('submittedReportHash:', msg);
          dispatch(updateAssets());
          dispatch(convertLogsToTransactions(TYPES.SUBMITTED_REPORT_HASH, [msg]));
        }
      },

      slashedRep: (msg) => {
        console.log('slashedRep:', msg);
        const { address } = getState().loginAccount;
        if (msg && (msg.sender === address || msg.reporter === address)) {
          dispatch(updateAssets());
          dispatch(convertLogsToTransactions(TYPES.SLASHED_REP, [msg]));
        }
      },

      // trade filled: { market, outcome (id), price }
      log_fill_tx: (msg) => {
        console.log('log_fill_tx:', msg);
        if (msg && msg.market && msg.price && msg.outcome != null) {
          dispatch(updateOutcomePrice(msg.market, msg.outcome, abi.bignum(msg.price)));
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
      },

      // short sell filled
      log_short_fill_tx: (msg) => {
        console.log('log_short_fill_tx:', msg);
        if (msg && msg.market && msg.price && msg.outcome != null) {
          dispatch(updateOutcomePrice(msg.market, msg.outcome, abi.bignum(msg.price)));
          dispatch(updateMarketTopicPopularity(msg.market, msg.amount));

          const { address } = getState().loginAccount;
          if (msg.sender !== address) dispatch(fillOrder({ ...msg, type: TYPES.SELL }));

          // if the user is either the maker or taker, add it to the transaction display
          if (msg.sender === address || msg.owner === address) {
            dispatch(updateAccountTradesData({
              [msg.market]: { [msg.outcome]: [{
                ...msg,
                isShortSell: true,
                maker: msg.owner === address
              }] }
            }));
            dispatch(updateAssets());
            dispatch(loadMarketsInfo([msg.market]));
          }
        }
      },

      // order added to orderbook
      log_add_tx: (msg) => {
        console.log('log_add_tx:', msg);
        if (msg && msg.market && msg.outcome != null) {
          if (msg.isShortAsk) {
            const market = getState().marketsData[msg.market];
            if (market && market.numOutcomes) {
              dispatch(updateMarketTopicPopularity(msg.market, new BigNumber(msg.amount, 10).times(market.numOutcomes)));
            } else {
              dispatch(loadMarketsInfo([msg.market], () => {
                const market = getState().marketsData[msg.market];
                if (market && market.numOutcomes) {
                  dispatch(updateMarketTopicPopularity(msg.market, new BigNumber(msg.amount, 10).times(market.numOutcomes)));
                }
              }));
            }
          }

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

      // order removed from orderbook
      log_cancel: (msg) => {
        console.log('log_cancel:', msg);
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

      completeSets_logReturn: (msg) => {
        if (msg) {
          console.log('completeSets_logReturn:', msg);
          let amount = new BigNumber(msg.amount, 10).times(msg.numOutcomes);
          if (msg.type === TYPES.SELL) amount = amount.neg();
          dispatch(updateMarketTopicPopularity(msg.market, amount.toFixed()));
        }
      },

      // new market: msg = { marketID }
      marketCreated: (msg) => {
        if (msg && msg.marketID) {
          console.log('marketCreated:', msg);
          dispatch(loadMarketsInfo([msg.marketID]));
          if (msg.sender === getState().loginAccount.address) {
            dispatch(updateAssets());
            dispatch(convertLogsToTransactions(TYPES.MARKET_CREATED, [msg]));
          }
        }
      },

      // market trading fee updated (decrease only)
      tradingFeeUpdated: (msg) => {
        console.log('tradingFeeUpdated:', msg);
        if (msg && msg.marketID) {
          dispatch(loadMarketsInfo([msg.marketID]));
          dispatch(updateAssets());
          dispatch(convertLogsToTransactions(TYPES.TRADING_FEE_UPDATED, [msg]));
        }
      },

      deposit: (msg) => {
        if (msg && msg.sender === getState().loginAccount.address) {
          console.log('deposit:', msg);
          dispatch(updateAssets());
          dispatch(convertLogsToTransactions(TYPES.DEPOSIT_ETHER, [msg]));
        }
      },

      withdraw: (msg) => {
        if (msg && msg.sender === getState().loginAccount.address) {
          console.log('withdraw:', msg);
          dispatch(updateAssets());
          dispatch(convertLogsToTransactions(TYPES.WITHDRAW_ETHER, [msg]));
        }
      },

      // Cash (ether) transfer
      sentCash: (msg) => {
        if (msg) {
          console.log('sentCash:', msg);
          const { address } = getState().loginAccount;
          if (msg._from === address || msg._to === address) {
            dispatch(updateAssets());
            dispatch(convertLogsToTransactions(TYPES.TRANSFER, [msg]));
          }
        }
      },

      // Reputation transfer
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

      closedMarket: (msg) => {
        if (msg && msg.market) {
          console.log('closedMarket:', msg);
          const { branch, loginAccount } = getState();
          if (branch.id === msg.branch) {
            dispatch(loadMarketsInfo([msg.market], () => {
              const { volume } = getState().marketsData[msg.market];
              dispatch(updateMarketTopicPopularity(msg.market, abi.bignum(volume).neg().toNumber()));
              if (loginAccount.address) dispatch(claimProceeds());
            }));
          }
        }
      }
    }, filters => console.log('Listening to filters:', filters));
  };
}

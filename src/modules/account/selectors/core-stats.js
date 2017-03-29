import { createSelector } from 'reselect';
import store from 'src/store';
import { augur, abi } from 'services/augurjs';
import { dateToBlock } from 'utils/date-to-block-to-date';
import { formatEther } from 'utils/format-number';
import { ZERO } from 'modules/trade/constants/numbers';
import { selectLoginAccount } from 'modules/account/selectors/login-account';
import selectLoginAccountPositions from 'modules/my-positions/selectors/login-account-positions';
import getValue from 'utils/get-value';

export default function () {
  return selectCoreStats(store.getState());
}

export const selectOutcomeLastPrice = (marketOutcomeData, outcomeID) => {
  if (!marketOutcomeData || !outcomeID) return null;
  return (marketOutcomeData[outcomeID] || {}).price;
};

// Period is in days
export const createPeriodPLSelector = period => createSelector(
  state => state.accountTrades,
  state => state.blockchain,
  state => state.outcomesData,
  (accountTrades, blockchain, outcomesData) => {
    if (!accountTrades || !blockchain) return null;
    const periodDate = new Date(Date.now() - (period*24*60*60*1000));
    const periodBlock = dateToBlock(periodDate, blockchain.currentBlockNumber);
    return Object.keys(accountTrades).reduce((p, marketID) => { // Iterate over marketIDs
      if (!outcomesData[marketID]) return p;
      const accumulatedPL = Object.keys(accountTrades[marketID]).reduce((p, outcomeID) => { // Iterate over outcomes
        const periodTrades = accountTrades[marketID][outcomeID].filter(trade => trade.blockNumber > periodBlock); // Filter out trades older than 30 days
        const lastPrice = selectOutcomeLastPrice(outcomesData[marketID], outcomeID);
        const { realized, unrealized } = augur.calculateProfitLoss(periodTrades, lastPrice);
        return p.plus(abi.bignum(realized).plus(abi.bignum(unrealized)));
      }, ZERO);
      return p.plus(accumulatedPL);
    }, ZERO);
  }
);

export const selectCoreStats = createSelector(
  state => state.accountTrades,
  state => state.blockchain,
  state => state.outcomesData,
  selectLoginAccount,
  selectLoginAccountPositions,
  createPeriodPLSelector(30),
  createPeriodPLSelector(1),
  (accountTrades, blockchain, outcomesData, loginAccount, loginAccountPositions, totalPLMonth, totalPLDay) => [
    // Group 1
    {
      totalEth: {
        label: 'ETH',
        title: 'Ether -- outcome trading currency',
        value: { ...loginAccount.ether, denomination: null }
      },
      totalRealEth: {
        label: 'Real ETH',
        title: 'Real Ether -- pays transaction gas fees',
        value: { ...loginAccount.realEther, denomination: null }
      },
      totalRep: {
        label: 'REP',
        title: 'Reputation -- event voting currency',
        value: { ...loginAccount.rep, denomination: null }
      }
    },
    // Group 2
    // NOTE -- group two is excluded for now due to not having all OPEN orders available without calling against every market
    // {
    //  totalRiskedEth: {
    //    label: 'Risked ETH',
    //    title: 'Risked Ether -- Ether tied up in positions',
    //    value: totalRiskedEth
    //  },
    //  totalAvailableEth: {
    //    label: 'Available ETH',
    //    title: 'Available Ether -- Ether not tied up in positions',
    //    value: totalAvailableEth
    //  }
    // },
    // Group 3
    {
      totalPL: {
        label: 'Total P/L',
        tile: 'Profit/Loss -- net of all trades',
        value: getValue(loginAccountPositions, 'summary.totalNet')
      },
      totalPLMonth: {
        label: '30 Day P/L',
        tile: 'Profit/Loss -- net of all trades over the last 30 days',
        value: formatEther(totalPLMonth)
      },
      totalPLDay: {
        label: '1 Day P/L',
        tile: 'Profit/Loss -- net of all trades over the last day',
        value: formatEther(totalPLDay)
      }
    }
  ]
);

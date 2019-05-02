import { useUnlockedAccount } from "src/modules/auth/actions/use-unlocked-account";
import { loadMarketsInfo } from "modules/markets/actions/load-markets-info";
import logError from "utils/log-error";
import { selectMarkets } from "src/modules/markets/selectors/markets-all";
import { loadMarkets } from "modules/markets/actions/load-markets";
import store from "src/store";
import { DISCLAIMER_SEEN } from "modules/common-elements/constants";
import { submitNewMarket } from "modules/markets/actions/submit-new-market";
import {
  selectCurrentTimestamp,
  selectBlockchainState,
  selectLoginAccountState
} from "src/select-state";
import { logout } from "modules/auth/actions/logout";
import { formatRep, formatEther } from "utils/format-number";
import getRep from "modules/account/actions/get-rep";
import { augur } from "services/augurjs";
import getMarketDisputeOutcomes from "modules/reports/selectors/select-market-dispute-outcomes";
import {
  getDaysRemaining,
  getHoursRemaining,
  getMinutesRemaining,
  convertUnixToFormattedDate
} from "utils/format-date";

const localStorageRef = typeof window !== "undefined" && window.localStorage;

const findMarketByDesc = (
  marketDescription,
  callback = logError
) => dispatch => {
  const marketsData = selectMarkets(store.getState());
  const market = marketsData.find(
    market => market.description === marketDescription
  );
  if (!market) {
    dispatch(
      loadMarkets((err, marketIds) => {
        if (err) return callback({ err });
        dispatch(
          loadMarketsInfo(marketIds, (err, markets) => {
            if (err) return callback({ err });
            Object.values(markets).forEach(market => {
              if (market.description === marketDescription) {
                return callback({ err: null, marketId: market.id });
              }
            });
            return callback({ err: "market not found" });
          })
        );
      })
    );
  } else {
    return callback({ err: null, marketId: market.id });
  }
};

const createMarket = (marketData, callback = logError) => dispatch => {
  dispatch(
    submitNewMarket(marketData, [], (err, marketId) => {
      if (err) return callback({ err });
      marketData.id = marketId;
      return callback({ err: null, market: marketData });
    })
  );
};

const getLoggedInAccountData = (callback = logError) => dispatch =>
  callback(selectLoginAccountState(store.getState()));

const formatRepValue = (value, callback = logError) => dispatch =>
  callback(formatRep(value));

const formatEthValue = (value, callback = logError) => dispatch =>
  callback(formatEther(value));

const getRepTokens = (callback = logError) => dispatch => {
  dispatch(
    getRep(err => {
      if (err) return callback({ err });
      return callback({ err: null });
    })
  );
};

const getMarketCosts = (callback = logError) => dispatch => {
  const { universe } = store.getState();

  augur.createMarket.getMarketCreationCostBreakdown(
    { universe: universe.id },
    (err, marketCreationCostBreakdown) => {
      if (err) return callback({ err });
      return callback({ err: null, data: marketCreationCostBreakdown });
    }
  );
};

const getDaysRemainingTime = (
  endTime,
  startTime,
  callback = logError
) => dispatch => callback(getDaysRemaining(endTime, startTime));
const getHoursRemainingTime = (
  endTime,
  startTime,
  callback = logError
) => dispatch => callback(getHoursRemaining(endTime, startTime));
const getMinutesRemainingTime = (
  endTime,
  startTime,
  callback = logError
) => dispatch => callback(getMinutesRemaining(endTime, startTime));
const convertUnixToFormattedDateTime = (
  date,
  callback = logError
) => dispatch => callback(convertUnixToFormattedDate(date));

const getReportingWindowStats = () => {
  const { reportingWindowStats } = store.getState();
  return reportingWindowStats;
};

export const helpers = store => {
  const { dispatch, whenever } = store;
  return {
    updateAccountAddress: account =>
      new Promise(resolve => {
        dispatch(
          useUnlockedAccount(account, () => {
            const unsubscribe = whenever(
              "loginAccount.address",
              account,
              () => {
                unsubscribe();
                resolve();
              }
            );
          })
        );
      }),
    hasDisclaimerModalBeenDismissed: () =>
      localStorageRef.getItem(DISCLAIMER_SEEN),
    findMarketId: marketDescription =>
      new Promise((resolve, reject) =>
        dispatch(
          findMarketByDesc(marketDescription, result => {
            if (result.err) return reject(result.err);
            resolve(result.marketId);
          })
        )
      ),
    createMarket: market =>
      new Promise((resolve, reject) =>
        dispatch(
          createMarket(market, result => {
            if (result.err) return reject(result.err);
            resolve(result.market);
          })
        )
      ),
    getCurrentTimestamp: () =>
      new Promise(resolve => resolve(selectCurrentTimestamp(store.getState()))),
    getCurrentBlock: () =>
      new Promise(resolve => resolve(selectBlockchainState(store.getState()))),
    logout: () => dispatch(logout()),
    getAccountData: () =>
      new Promise(resolve => dispatch(getLoggedInAccountData(resolve))),
    formatRep: value =>
      new Promise(resolve => dispatch(formatRepValue(value, resolve))),
    formatEth: value =>
      new Promise(resolve => dispatch(formatEthValue(value, resolve))),
    getRep: () =>
      new Promise((resolve, reject) =>
        dispatch(
          getRepTokens(result => {
            if (result.err) return reject();
            resolve();
          })
        )
      ),
    getMarketCreationCostBreakdown: () =>
      new Promise((resolve, reject) =>
        dispatch(
          getMarketCosts(result => {
            if (result.err) return reject();
            resolve(result.data);
          })
        )
      ),
    getMarketDisputeOutcomes: () => getMarketDisputeOutcomes(),
    getReportingWindowStats: () => getReportingWindowStats(),
    getDaysRemaining: (endTime, startTime) =>
      new Promise(resolve =>
        dispatch(getDaysRemainingTime(endTime, startTime, resolve))
      ),
    getHoursRemaining: (endTime, startTime) =>
      new Promise(resolve =>
        dispatch(getHoursRemainingTime(endTime, startTime, resolve))
      ),
    getMinutesRemaining: (endTime, startTime) =>
      new Promise(resolve =>
        dispatch(getMinutesRemainingTime(endTime, startTime, resolve))
      ),
    convertUnixToFormattedDate: date =>
      new Promise(resolve =>
        dispatch(convertUnixToFormattedDateTime(date, resolve))
      )
  };
};

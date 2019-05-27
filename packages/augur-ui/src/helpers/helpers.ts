import { useUnlockedAccount } from "modules/auth/actions/use-unlocked-account";
import { loadMarketsInfo } from "modules/markets/actions/load-markets-info";
import logError from "utils/log-error";
import { selectMarkets } from "modules/markets/selectors/markets-all";
import { loadMarkets } from "modules/markets/actions/load-markets";
import store from "store";
import { DISCLAIMER_SEEN } from "modules/common-elements/constants";
import { submitNewMarket } from "modules/markets/actions/submit-new-market";
import {
  selectCurrentTimestamp,
} from "store/select-state";
import { logout } from "modules/auth/actions/logout";
import { formatRep, formatEther } from "utils/format-number";
import getRep from "modules/account/actions/get-rep";
import { augur } from "services/augurjs";
import getMarketDisputeOutcomes from "modules/reports/selectors/select-market-dispute-outcomes";
import {
  getDaysRemaining,
  getHoursRemaining,
  getMinutesRemaining,
  convertUnixToFormattedDate,
} from "utils/format-date";
import { MarketData } from "modules/types";

const localStorageRef = typeof window !== "undefined" && window.localStorage;

const findMarketByDesc = (
  marketDescription: string,
  callback = logError,
) => (dispatch) => {
  const marketsData: Array<MarketData> = selectMarkets(store.getState());
  const market = marketsData.find(
    (market) => market.description === marketDescription,
  );
  if (!market) {
    dispatch(
      loadMarkets((err, marketIds) => {
        if (err) return callback({ err });
        dispatch(
          loadMarketsInfo(marketIds, (err, markets) => {
            if (err) return callback({ err });
            Object.values(markets).forEach((market: MarketData) => {
              if (market.description === marketDescription) {
                return callback({ err: null, marketId: market.id });
              }
            });
            return callback({ err: "market not found" });
          }),
        );
      }),
    );
  } else {
    return callback({ err: null, marketId: market.id });
  }
};

const createMarket = (marketData, callback = logError) => (dispatch) => {
  dispatch(
    submitNewMarket(marketData, [], (err, marketId) => {
      if (err) return callback({ err });
      marketData.id = marketId;
      return callback({ err: null, market: marketData });
    }),
  );
};

const getLoggedInAccountData = (callback = logError) => (dispatch) =>
  callback({ err: null, data: store.getState().loginAccount });

const formatRepValue = (value, callback = logError) => (dispatch) =>
  callback({ err: null, data: formatRep(value, {}) });

const formatEthValue = (value, callback = logError) => (dispatch) =>
  callback(formatEther(value, {}));

const getRepTokens = (callback = logError) => (dispatch) => {
  dispatch(
    getRep((err: Error) => {
      if (err) return callback({ err });
      return callback({ err: null });
    }),
  );
};

const getMarketCosts = (callback = logError) => (dispatch) => {
  const { universe } = store.getState();

  augur.createMarket.getMarketCreationCostBreakdown(
    { universe: universe.id },
    (err, marketCreationCostBreakdown) => {
      if (err) return callback({ err });
      return callback({ err: null, data: marketCreationCostBreakdown });
    },
  );
};

const getDaysRemainingTime = (
  endTime,
  startTime,
  callback = logError,
) => (dispatch) => callback({ err: null, data: getDaysRemaining(endTime, startTime) });
const getHoursRemainingTime = (
  endTime,
  startTime,
  callback = logError,
) => (dispatch) => callback({ err: null, data: getHoursRemaining(endTime, startTime) });
const getMinutesRemainingTime = (
  endTime,
  startTime,
  callback = logError,
) => (dispatch) => callback({ err: null, data: getMinutesRemaining(endTime, startTime) });
const convertUnixToFormattedDateTime = (
  date,
  callback = logError,
) => (dispatch) => callback({ err: null, data: convertUnixToFormattedDate(date) });

const getReportingWindowStats = () => {
  const { reportingWindowStats } = store.getState();
  return reportingWindowStats;
};

export const helpers = (store: any) => {
  const { dispatch, whenever } = store;
  return {
    updateAccountAddress: (account: string) =>
      new Promise((resolve) => {
        dispatch(
          useUnlockedAccount(account, () => {
            const unsubscribe = whenever(
              "loginAccount.address",
              account,
              () => {
                unsubscribe();
                resolve();
              },
            );
          }),
        );
      }),
    hasDisclaimerModalBeenDismissed: () =>
      (localStorageRef as Storage).getItem(DISCLAIMER_SEEN),
    findMarketId: (marketDescription: string) =>
      new Promise((resolve, reject) =>
        dispatch(
          findMarketByDesc(
            marketDescription,
            (result: { err: Error; marketId: string }) => {
              if (result.err) return reject(result.err);
              resolve(result.marketId);
            },
          ),
        ),
      ),
    createMarket: (market: MarketData) =>
      new Promise((resolve, reject) =>
        dispatch(
          createMarket(market, (result: { err: Error; market: MarketData }) => {
            if (result.err) return reject(result.err);
            resolve(result.market);
          }),
        ),
      ),
    getCurrentTimestamp: () =>
      new Promise((resolve) => resolve(selectCurrentTimestamp(store.getState()))),
    getCurrentBlock: () =>
      new Promise((resolve) => resolve(store.getState().blockchain)),
    logout: () => dispatch(logout()),
    getAccountData: (): Promise<any> =>
      new Promise((resolve) => dispatch(getLoggedInAccountData(resolve))),
    formatRep: (value: number | string): Promise<any> =>
      new Promise((resolve) => dispatch(formatRepValue(value, resolve))),
    formatEth: (value: number | string): Promise<any> =>
      new Promise((resolve) => dispatch(formatEthValue(value, resolve))),
    getRep: () =>
      new Promise((resolve, reject) =>
        dispatch(
          getRepTokens((result: { err: Error }) => {
            if (result.err) return reject();
            resolve();
          }),
        ),
      ),
    getMarketCreationCostBreakdown: () =>
      new Promise((resolve, reject) =>
        dispatch(
          getMarketCosts((result: { err: Error; data: object }) => {
            if (result.err) return reject();
            resolve(result.data);
          }),
        ),
      ),
    getMarketDisputeOutcomes: () => getMarketDisputeOutcomes(),
    getReportingWindowStats: () => getReportingWindowStats(),
    getDaysRemaining: (endTime, startTime): Promise<any> =>
      new Promise((resolve) =>
        dispatch(getDaysRemainingTime(endTime, startTime, resolve)),
      ),
    getHoursRemaining: (endTime, startTime): Promise<any> =>
      new Promise((resolve) =>
        dispatch(getHoursRemainingTime(endTime, startTime, resolve)),
      ),
    getMinutesRemaining: (endTime, startTime): Promise<any> =>
      new Promise((resolve) =>
        dispatch(getMinutesRemainingTime(endTime, startTime, resolve)),
      ),
    convertUnixToFormattedDate: (date): Promise<any> =>
      new Promise((resolve) =>
        dispatch(convertUnixToFormattedDateTime(date, resolve)),
      ),
  };
};

import { useUnlockedAccount } from "modules/auth/actions/use-unlocked-account";
import { loadMarketsInfo } from "modules/markets/actions/load-markets-info";
import logError from "utils/log-error";
import { selectMarkets } from "modules/markets/selectors/markets-all";
import { loadMarkets } from "modules/markets/actions/load-markets";
import store, { AppState } from "store";
import { DISCLAIMER_SEEN } from "modules/common/constants";
import { submitNewMarket } from "modules/markets/actions/submit-new-market";
import { selectCurrentTimestamp } from "store/select-state";
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
import { MarketData, NodeStyleCallback, MarketInfos } from "modules/types";

const localStorageRef = typeof window !== "undefined" && window.localStorage;

const findMarketByDesc = (
  marketDescription: string,
  callback: NodeStyleCallback = logError
) => dispatch => {
  const marketsData: Array<MarketData> = selectMarkets(store.getState());
  const market = marketsData.find(
    market => market.description === marketDescription
  );
  if (!market) {
    dispatch(
      loadMarkets((err: string, marketIds) => {
        if (err) return callback(err);
        dispatch(
          loadMarketsInfo(marketIds, (err, markets) => {
            if (err) return callback(err);
            Object.values(markets).forEach(value => {
              const market: MarketData = value as MarketData;
              if (market.description === marketDescription) {
                return callback(null, { marketId: market.id });
              }
            });
            return callback("market not found");
          })
        );
      })
    );
  } else {
    return callback(null, { marketId: market.id });
  }
};

const createMarket = (
  marketData,
  callback: NodeStyleCallback = logError
) => dispatch => {
  dispatch(
    submitNewMarket(marketData, [], (err, marketId) => {
      if (err) return callback(err);
      marketData.id = marketId;
      return callback(null, { market: marketData });
    })
  );
};

const getLoggedInAccountData = (
  callback: NodeStyleCallback = logError
) => (dispatch, getState: () => AppState) => callback(null, { data: getState().loginAccount });

const formatRepValue = (
  value,
  callback: NodeStyleCallback = logError
) => dispatch => callback(null, { data: formatRep(value) });

const formatEthValue = (
  value: number | string,
  callback: NodeStyleCallback = logError
) => dispatch => callback(null, formatEther(value));

const getRepTokens = (callback: NodeStyleCallback = logError) => dispatch => {
  dispatch(
    getRep((err) => {
      if (err) return callback(err);
      return callback(null);
    })
  );
};

const getMarketCosts = (callback: NodeStyleCallback = logError) => (dispatch, getState: () => AppState) => {
  const { universe } = getState();

  augur.createMarket.getMarketCreationCostBreakdown(
    { universe: universe.id },
    (err: any, marketCreationCostBreakdown) => {
      if (err) return callback(err);
      return callback(null, { data: marketCreationCostBreakdown });
    }
  );
};

const getDaysRemainingTime = (
  endTime,
  startTime,
  callback: NodeStyleCallback = logError
) => dispatch =>
  callback(null, { data: getDaysRemaining(endTime, startTime) });
const getHoursRemainingTime = (
  endTime,
  startTime,
  callback: NodeStyleCallback = logError
) => dispatch =>
  callback(null, { data: getHoursRemaining(endTime, startTime) });
const getMinutesRemainingTime = (
  endTime,
  startTime,
  callback: NodeStyleCallback = logError
) => dispatch =>
  callback(null, { data: getMinutesRemaining(endTime, startTime) });
const convertUnixToFormattedDateTime = (
  date,
  callback: NodeStyleCallback = logError
) => dispatch =>
  callback(null, { data: convertUnixToFormattedDate(date) });

const getReportingWindowStats = () => {
  const { reportingWindowStats } = store.getState() as AppState;
  return reportingWindowStats;
};

export const helpers = (store: any) => {
  const { dispatch, whenever } = store;
  return {
    updateAccountAddress: (account: string) =>
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
      (localStorageRef as Storage).getItem(DISCLAIMER_SEEN),
    findMarketId: (marketDescription: string) =>
      new Promise((resolve, reject) =>
        dispatch(
          findMarketByDesc(
            marketDescription,
            (err, result: { marketId: string }) => {
              if (err) return reject(err);
              resolve(result.marketId);
            }
          )
        )
      ),
    createMarket: (market: MarketData) =>
      new Promise((resolve, reject) =>
        dispatch(
          createMarket(market, (err: any, result: { market: MarketData }) => {
            if (err) return reject(err);
            resolve(result.market);
          })
        )
      ),
    getCurrentTimestamp: () =>
      new Promise(resolve => resolve(selectCurrentTimestamp(store.getState()))),
    getCurrentBlock: () =>
      new Promise(resolve => resolve(store.getState().blockchain)),
    logout: () => dispatch(logout()),
    getAccountData: (): Promise<any> =>
      new Promise(resolve => dispatch(getLoggedInAccountData(resolve))),
    formatRep: (value: number | string): Promise<any> =>
      new Promise(resolve => dispatch(formatRepValue(value, resolve))),
    formatEth: (value: number | string): Promise<any> =>
      new Promise(resolve => dispatch(formatEthValue(value, resolve))),
    getRep: () =>
      new Promise((resolve, reject) =>
        dispatch(
          getRepTokens((err, result) => {
            if (err || result.err) return reject();
            resolve();
          })
        )
      ),
    getMarketCreationCostBreakdown: () =>
      new Promise((resolve, reject) =>
        dispatch(
          getMarketCosts((err, result) => {
            if (err || result.err) return reject();
            resolve(result.data);
          })
        )
      ),
    getMarketDisputeOutcomes: () => getMarketDisputeOutcomes(),
    getReportingWindowStats: () => getReportingWindowStats(),
    getDaysRemaining: (endTime, startTime): Promise<any> =>
      new Promise(resolve =>
        dispatch(getDaysRemainingTime(endTime, startTime, resolve))
      ),
    getHoursRemaining: (endTime, startTime): Promise<any> =>
      new Promise(resolve =>
        dispatch(getHoursRemainingTime(endTime, startTime, resolve))
      ),
    getMinutesRemaining: (endTime, startTime): Promise<any> =>
      new Promise(resolve =>
        dispatch(getMinutesRemainingTime(endTime, startTime, resolve))
      ),
    convertUnixToFormattedDate: (date): Promise<any> =>
      new Promise(resolve =>
        dispatch(convertUnixToFormattedDateTime(date, resolve))
      )
  };
};

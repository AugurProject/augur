import { augur } from "services/augurjs";
import logError from "utils/log-error";
import async from "async";
import { createBigNumber } from "utils/create-big-number";
import { updateUniverse } from "modules/universe/actions/update-universe";
import { loadMarketsInfoIfNotLoaded } from "modules/markets/actions/load-markets-info";
import { selectReportableOutcomes } from "modules/reports/selectors/reportable-outcomes";
import calculatePayoutNumeratorsValue from "utils/calculate-payout-numerators-value";
import {
  SCALAR,
  NULL_ADDRESS,
  UNIVERSE_ID
} from "modules/common-elements/constants";

const REQUIRED_GENESIS_SUPPLY = createBigNumber(
  "1100000000000000000000000",
  10
);

export function loadUniverseInfo(callback: Function = logError) {
  return (dispatch: Function, getState: Function) => {
    const { universe, loginAccount, marketsData } = getState();
    const universeId = universe.id || UNIVERSE_ID;

    const universeData = {
      market: null,
      id: universeId,
      reportableOutcomes: null,
      winningChildUniverseId: null,
      openInterest: universe.openInterest || "0"
    };

    if (universe.isForking && marketsData[universe.forkingMarket]) {
      const forkingMarket = marketsData[universe.forkingMarket];
      universeData.market = forkingMarket;
      universeData.reportableOutcomes = selectReportableOutcomes(
        forkingMarket.marketType,
        forkingMarket.outcomes
      );
      universeData.winningChildUniverseId = universe.winningChildUniverse;
    }

    augur.api.Universe.getParentUniverse(
      { tx: { to: universeId } },
      (err: any, parentUniverseId: String) => {
        if (err) return callback(err);

        if (parentUniverseId === NULL_ADDRESS) {
          return getUniversesInfoWithParentContext(
            loginAccount.address,
            universeData,
            { id: parentUniverseId },
            { id: parentUniverseId },
            callback
          );
        }

        getUniverseInfo(
          parentUniverseId,
          (err: any, parentUniverseData: any) => {
            if (err) return callback(err);

            augur.api.Universe.getParentUniverse(
              { tx: { to: parentUniverseData.id } },
              (err: any, grandParentUniverseId: String) => {
                if (err) return callback(err);

                if (grandParentUniverseId === NULL_ADDRESS) {
                  return getUniversesInfoWithParentContext(
                    loginAccount.address,
                    universeData,
                    parentUniverseData,
                    { id: grandParentUniverseId },
                    callback
                  );
                }

                getUniverseInfo(
                  grandParentUniverseId,
                  (err: any, grandParentUniverseData: any) => {
                    if (err) return callback(err);
                    return getUniversesInfoWithParentContext(
                      loginAccount.address,
                      universeData,
                      parentUniverseData,
                      grandParentUniverseData,
                      callback
                    );
                  }
                );
              }
            );
          }
        );
      }
    );
  };
}

function getUniverseInfo(universeId: String, callback: Function) {
  const universeData: any = {
    id: universeId,
    reportableOutcomes: null,
    winningChildUniverseId: null,
    market: null,
    openInterest: "0"
  };

  augur.api.Universe.getForkingMarket(
    { tx: { to: universeId } },
    (err: any, forkingMarket: any) => {
      if (err) return callback(err);
      augur.markets.getMarketsInfo(
        { marketIds: [forkingMarket] },
        (err: any, marketsDataArray: Array<any>) => {
          if (err) return callback(err);
          universeData.market = marketsDataArray[0];
          universeData.reportableOutcomes = selectReportableOutcomes(
            universeData.market.marketType,
            universeData.market.outcomes
          );
          augur.api.Market.isFinalized(
            { tx: { to: forkingMarket } },
            (err: any, isForkingMarketFinalized: Boolean) => {
              if (err) return callback(err);
              if (!isForkingMarketFinalized) {
                return callback(null, universeData);
              }
              augur.api.Universe.getWinningChildUniverse(
                { tx: { to: universeId } },
                (err: any, winningChildUniverse: String) => {
                  if (err) return callback(err);
                  universeData.winningChildUniverseId = winningChildUniverse;
                  return callback(null, universeData);
                }
              );
            }
          );
        }
      );
    }
  );
}

function getUniversesInfoWithParentContext(
  account: String,
  currentUniverseData: any,
  parentUniverseData: any,
  grandParentUniverseData: any,
  callback: Function
) {
  augur.augurNode.submitRequest(
    "getUniversesInfo",
    {
      universe: currentUniverseData.id,
      account
    },
    (err: any, result: any) => {
      if (err) return callback(err);
      const initialMapping = {
        parent: null,
        children: [],
        currentLevel: []
      };

      async.forEachOf(
        result,
        (obj: any, key, callback: Function) => {
          augur.api.Universe.getOpenInterestInAttoEth(
            { tx: { to: obj.universe } },
            (err: any, openInterest: number) => {
              // give default value of 0, there might have been error
              obj.openInterest = openInterest || 0;
              callback(err, obj);
            }
          );
        },
        err => {
          callback(
            err,
            result.reduce((acc: any, universeData: any) => {
              const supply = createBigNumber(universeData.supply || "0", 10);
              if (
                universeData.parentUniverse ===
                  "0x0000000000000000000000000000000000000000" &&
                supply.lt(REQUIRED_GENESIS_SUPPLY) &&
                universeData.numMarkets === 0
              ) {
                return acc;
              } else if (
                universeData.parentUniverse === currentUniverseData.id
              ) {
                universeData.description = getUniverseName(
                  currentUniverseData,
                  universeData
                );
                universeData.isWinningUniverse =
                  currentUniverseData.winningChildUniverseId ===
                  universeData.universe;
                acc.children.push(universeData);
              } else if (
                universeData.parentUniverse === parentUniverseData.id
              ) {
                universeData.description = getUniverseName(
                  parentUniverseData,
                  universeData
                );
                universeData.isWinningUniverse =
                  parentUniverseData.winningChildUniverseId ===
                  universeData.universe;
                if (universeData.universe === currentUniverseData.id) {
                  acc.currentLevel = [universeData].concat(acc.currentLevel);
                } else {
                  acc.currentLevel.push(universeData);
                }
              } else {
                universeData.description = getUniverseName(
                  grandParentUniverseData,
                  universeData
                );
                universeData.isWinningUniverse =
                  grandParentUniverseData.winningChildUniverseId ===
                  universeData.universe;
                acc.parent = universeData;
              }
              return acc;
            }, initialMapping)
          );
        }
      );
    }
  );
}

function getUniverseName(parentUniverseData: any, universeData: any) {
  if (!parentUniverseData.market) return "GENESIS";

  if (universeData.isInvalid) return "Invalid";

  const outcomeId = calculatePayoutNumeratorsValue(
    parentUniverseData.market,
    universeData.payout,
    universeData.isInvalid
  ).toString();
  if (parentUniverseData.market.marketType === SCALAR) {
    return outcomeId;
  }

  const outcome = parentUniverseData.reportableOutcomes[outcomeId];
  const outComeLabel = outcome && (outcome.description || outcome.name);
  return outComeLabel || "Unidentified";
}

export function getForkingInfo(universe: any, callback: Function = logError) {
  return (dispatch: Function, getState: Function) => {
    const universePayload = { tx: { to: universe.id } };
    // Getting current fork data
    augur.api.Universe.getForkingMarket(
      universePayload,
      (err: any, forkingMarket: any) => {
        if (err) return callback(err);
        const isForking =
          forkingMarket !== "0x0000000000000000000000000000000000000000";
        if (isForking) {
          dispatch(loadMarketsInfoIfNotLoaded([forkingMarket]));
          async.parallel(
            {
              forkEndTime: next => {
                augur.api.Universe.getForkEndTime(
                  universePayload,
                  (err: any, forkEndTime: number) => {
                    if (err) return next(err);
                    next(null, forkEndTime);
                  }
                );
              },
              isForkingMarketFinalized: next => {
                augur.api.Market.isFinalized(
                  { tx: { to: forkingMarket } },
                  (err: any, isForkingMarketFinalized: Boolean) => {
                    if (err) return next(err);
                    next(null, isForkingMarketFinalized);
                  }
                );
              },
              forkReputationGoal: next => {
                augur.api.Universe.getForkReputationGoal(
                  universePayload,
                  (err: any, forkReputationGoal: String) => {
                    if (err) return next(err);
                    next(null, forkReputationGoal);
                  }
                );
              }
            },
            (err, universeData) => {
              if (err) return callback(err);
              if (universeData.isForkingMarketFinalized) {
                augur.api.Universe.getWinningChildUniverse(
                  universePayload,
                  (err: any, winningChildUniverse: String) => {
                    if (err) return callback(err);
                    updateUniverseIfForkingDataChanged(dispatch, universe, {
                      ...universeData,
                      forkingMarket,
                      winningChildUniverse,
                      isForking
                    });
                  }
                );
              } else {
                updateUniverseIfForkingDataChanged(dispatch, universe, {
                  ...universeData,
                  forkingMarket,
                  isForking,
                  winningChildUniverse: undefined
                });
              }
            }
          );
        } else {
          updateUniverseIfForkingDataChanged(dispatch, universe, {
            isForking,
            forkingMarket,
            forkEndTime: undefined,
            isForkingMarketFinalized: undefined,
            winningChildUniverse: undefined
          });
        }
      }
    );
  };
}

function updateUniverseIfForkingDataChanged(
  dispatch: Function,
  oldUniverseData: any,
  universeData: any
) {
  if (
    (universeData.id && oldUniverseData.id !== universeData.id) ||
    oldUniverseData.isForking !== universeData.isForking ||
    oldUniverseData.forkingMarket !== universeData.forkingMarket ||
    oldUniverseData.forkEndTime !== universeData.forkEndTime ||
    oldUniverseData.isForkingMarketFinalized !==
      universeData.isForkingMarketFinalized ||
    oldUniverseData.winningChildUniverse !== universeData.winningChildUniverse
  ) {
    dispatch(updateUniverse(universeData));
  }
}

export function getUniverseProperties(universe: any, callback: Function) {
  return (dispatch: Function, getState: Function) => {
    const universePayload = { tx: { to: universe.id } };

    async.parallel(
      {
        forkThreshold: next => {
          augur.api.Universe.getDisputeThresholdForFork(
            universePayload,
            (err: any, disputeThresholdForFork: String) => {
              if (err) return next(err);
              const forkThreshold = createBigNumber(
                disputeThresholdForFork,
                10
              );
              if (forkThreshold !== universe.forkThreshold) {
                next(null, forkThreshold);
              }
            }
          );
        },
        openInterest: next => {
          augur.api.Universe.getOpenInterestInAttoEth(
            universePayload,
            (err: any, openInterest: String) => {
              if (err) return next(err);
              next(null, openInterest);
            }
          );
        }
      },
      (err, universeData) => {
        dispatch(updateUniverse(universeData));
        if (callback) callback(err, universeData);
      }
    );
  };
}

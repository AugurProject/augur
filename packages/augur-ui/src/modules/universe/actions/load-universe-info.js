import { augur } from "services/augurjs";
import logError from "utils/log-error";
import async from "async";
import { createBigNumber } from "utils/create-big-number";
import { updateUniverse } from "modules/universe/actions/update-universe";
import { selectReportableOutcomes } from "modules/reports/selectors/reportable-outcomes";
import calculatePayoutNumeratorsValue from "utils/calculate-payout-numerators-value";
import {
  getDisputeThresholdForFork,
  getOpenInterestInAttoCash,
  getForkingMarket,
  getForkEndTime,
  getForkReputationGoal,
  getWinningChildUniverse,
  isFinalized
} from "modules/contracts/actions/contractCalls";
import {
  SCALAR,
  NULL_ADDRESS,
  UNIVERSE_ID
} from "modules/common-elements/constants";

const REQUIRED_GENESIS_SUPPLY = createBigNumber(
  "1100000000000000000000000",
  10
);

// TODO: this whole thing will be refactored
export function loadUniverseInfo(callback = logError) {
  return (dispatch, getState) => {
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
      (err, parentUniverseId) => {
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

        getUniverseInfo(parentUniverseId, (err, parentUniverseData) => {
          if (err) return callback(err);

          augur.api.Universe.getParentUniverse(
            { tx: { to: parentUniverseData.id } },
            (err, grandParentUniverseId) => {
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
                (err, grandParentUniverseData) => {
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
        });
      }
    );
  };
}

// TODO: this whole thing will be refactored
function getUniverseInfo(universeId, callback) {
  const universeData = {
    id: universeId,
    reportableOutcomes: null,
    winningChildUniverseId: null,
    market: null,
    openInterest: "0"
  };

  augur.api.Universe.getForkingMarket(
    { tx: { to: universeId } },
    (err, forkingMarket) => {
      if (err) return callback(err);
      augur.markets.getMarketsInfo(
        { marketIds: [forkingMarket] },
        (err, marketsDataArray) => {
          if (err) return callback(err);
          universeData.market = marketsDataArray[0];
          universeData.reportableOutcomes = selectReportableOutcomes(
            universeData.market.marketType,
            universeData.market.outcomes
          );
          augur.api.Market.isFinalized(
            { tx: { to: forkingMarket } },
            (err, isForkingMarketFinalized) => {
              if (err) return callback(err);
              if (!isForkingMarketFinalized) {
                return callback(null, universeData);
              }
              augur.api.Universe.getWinningChildUniverse(
                { tx: { to: universeId } },
                (err, winningChildUniverse) => {
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

// TODO: this whole thing will be refactored
function getUniversesInfoWithParentContext(
  account,
  currentUniverseData,
  parentUniverseData,
  grandParentUniverseData,
  callback
) {
  augur.augurNode.submitRequest(
    "getUniversesInfo",
    {
      universe: currentUniverseData.id,
      account
    },
    (err, result) => {
      if (err) return callback(err);
      const initialMapping = {
        parent: null,
        children: [],
        currentLevel: []
      };

      async.forEachOf(
        result,
        (obj, key, callback) => {
          // TODO: this whole thing will be refactored
          augur.api.Universe.getOpenInterestInAttoEth(
            { tx: { to: obj.universe } },
            (err, openInterest) => {
              // give default value of 0, there might have been error
              obj.openInterest = openInterest || 0;
              callback(err, obj);
            }
          );
        },
        err => {
          callback(
            err,
            result.reduce((acc, universeData) => {
              const supply = createBigNumber(universeData.supply || "0", 10);
              if (
                universeData.parentUniverse ===
                  "0x0000000000000000000000000000000000000000" &&
                supply.lt(REQUIRED_GENESIS_SUPPLY) &&
                universeData.numMarkets === 0
              ) {
                return acc;
              }
              if (universeData.parentUniverse === currentUniverseData.id) {
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

function getUniverseName(parentUniverseData, universeData) {
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

// TODO: this whole thing will be refactored
export function getForkingInfo(universe, callback = logError) {
  return async dispatch => {
    // Getting current fork data
    const forkingMarket = await getForkingMarket();
    const isForking =
      forkingMarket !== "0x0000000000000000000000000000000000000000";
    if (isForking) {
      const forkEndTime = await getForkEndTime();
      const forkReputationGoal = await getForkReputationGoal();
      const isForkingMarketFinalized = await isFinalized(forkingMarket);
      let winningChildUniverse;
      if (isForkingMarketFinalized) {
        winningChildUniverse = await getWinningChildUniverse();
      }
      updateUniverseIfForkingDataChanged(dispatch, universe, {
        forkEndTime,
        forkReputationGoal,
        forkingMarket,
        isForking,
        winningChildUniverse
      });
    }
  };
}

// TODO: this whole thing will be refactored
function updateUniverseIfForkingDataChanged(
  dispatch,
  oldUniverseData,
  universeData
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

export function getUniverseProperties(universe, callback) {
  return async dispatch => {
    const openInterest = await getOpenInterestInAttoCash();
    const forkThreshold = await getDisputeThresholdForFork();
    const universeData = { openInterest, forkThreshold };
    dispatch(updateUniverse(universeData));
    if (callback) callback(universeData);
  };
}

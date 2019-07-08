import logError from 'utils/log-error';
import async from 'async';
import { createBigNumber } from 'utils/create-big-number';
import { updateUniverse } from 'modules/universe/actions/update-universe';
import { selectReportableOutcomes } from 'modules/reports/selectors/reportable-outcomes';
import calculatePayoutNumeratorsValue from 'utils/calculate-payout-numerators-value';
import {
  getDisputeThresholdForFork,
  getOpenInterestInAttoCash,
  getForkingMarket,
  getForkEndTime,
  getForkReputationGoal,
  getWinningChildUniverse,
  isFinalized,
} from 'modules/contracts/actions/contractCalls';
import {
  SCALAR,
  NULL_ADDRESS,
  UNIVERSE_ID,
  REPORTING_STATE,
} from 'modules/common/constants';
import { AppState } from 'store';
import { NodeStyleCallback, Universe } from 'modules/types';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';
import { augurSdk } from 'services/augursdk';

const REQUIRED_GENESIS_SUPPLY = createBigNumber(
  '1100000000000000000000000',
  10
);

export function loadUniverseInfo(callback: NodeStyleCallback = logError) {
  return async (
    dispatch: ThunkDispatch<void, any, Action>,
    getState: () => AppState
  ) => {
    const { universe, loginAccount, marketInfos } = getState();
    const universeId = universe.id || UNIVERSE_ID;

    if (!loginAccount.address) return;

    const address = loginAccount.address;
    const universeData: Universe = {
      market: undefined,
      forkingMarket: undefined,
      id: universeId,
      winningChildUniverse: undefined,
      openInterest: universe.openInterest || '0',
      outcomes: null,
    };

    if (
      universe.isForking &&
      universe.forkingMarket &&
      marketInfos[universe.forkingMarket]
    ) {
      const forkingMarket = marketInfos[universe.forkingMarket];
      universeData.market = forkingMarket;
      universeData.outcomes = forkingMarket.outcomes;
      universeData.winningChildUniverseId = universe.winningChildUniverse;
    }

    const { contracts } = augurSdk.get();
    const parentUniverseId = await contracts.universe.getParentUniverse_({
      sender: universeId,
    });
    if (parentUniverseId === NULL_ADDRESS) {
      return getUniversesInfoWithParentContext(
        address,
        universeData,
        { id: parentUniverseId },
        { id: parentUniverseId },
        callback
      );
    }

    getUniverseInfo(
      parentUniverseId,
      async (err: any, parentUniverseData: any) => {
        if (err) return callback(err);

        const grandParentUniverseId = await contracts.universe.getParentUniverse_(
          { sender: parentUniverseData.id }
        );
        if (grandParentUniverseId === NULL_ADDRESS) {
          return getUniversesInfoWithParentContext(
            address,
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
              address,
              universeData,
              parentUniverseData,
              grandParentUniverseData,
              callback
            );
          }
        );
      }
    );
  };
}

async function getUniverseInfo(
  universeId: string,
  callback: NodeStyleCallback
) {
  const universeData: Universe = {
    id: universeId,
    outcomes: undefined,
    winningChildUniverseId: undefined,
    market: undefined,
    openInterest: '0',
  };
  const { contracts } = augurSdk.get();
  const forkingMarket = await contracts.universe.getForkingMarket_();
  const sdk = augurSdk.get();
  const marketsDataArray = await sdk.getMarketsInfo({
    marketIds: [forkingMarket],
  });

  universeData.market = marketsDataArray[0];
  universeData.outcomes = marketsDataArray[0].outcomes;
  const isForkingMarketFinalized =
    universeData.market.reportingState == REPORTING_STATE.FINALIZED;
  if (!isForkingMarketFinalized) {
    return callback(null, universeData);
  }
  const winningChildUniverse = await contracts.universe.getWinningChildUniverse_();
  universeData.winningChildUniverseId = winningChildUniverse;
  return callback(null, universeData);
}

// TODO: this whole thing will be refactored
function getUniversesInfoWithParentContext(
  account: string,
  currentUniverseData: any,
  parentUniverseData: any,
  grandParentUniverseData: any,
  callback: NodeStyleCallback
) {
  return {};
  // TODO: this is needed for getting parent stats
  /*
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
        (obj: any, key, callback: NodeStyleCallback) => {
          .api.Universe.getOpenInterestInAttoEth(
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
            // @ts-ignore
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
  */
}

function getUniverseName(parentUniverseData: any, universeData: any) {
  if (!parentUniverseData.market) return 'GENESIS';

  if (universeData.isInvalid) return 'Invalid';

  // @ts-ignore
  const outcomeId = calculatePayoutNumeratorsValue(
    parentUniverseData.market,
    universeData.payout
  ).toString();
  if (parentUniverseData.market.marketType === SCALAR) {
    return outcomeId;
  }

  const outcome = parentUniverseData.outcomes[outcomeId];
  const outComeLabel = outcome && (outcome.description || outcome.name);
  return outComeLabel || 'Unidentified';
}

// TODO: this whole thing will be refactored
export function getForkingInfo(
  universe: Universe,
  callback: NodeStyleCallback = logError
) {
  return async (dispatch: ThunkDispatch<void, any, Action>) => {
    // Getting current fork data
    const forkingMarket = await getForkingMarket();
    const isForking =
      forkingMarket !== '0x0000000000000000000000000000000000000000';
    if (isForking) {
      const forkEndTime = await getForkEndTime();
      const forkReputationGoal = await getForkReputationGoal();
      const isForkingMarketFinalized = await isFinalized(forkingMarket);
      let winningChildUniverse;
      if (isForkingMarketFinalized) {
        winningChildUniverse = await getWinningChildUniverse();
      }
      updateUniverseIfForkingDataChanged(dispatch, universe, {
        forkEndTime: forkEndTime.toNumber(),
        forkReputationGoal,
        forkingMarket,
        isForking,
        winningChildUniverse,
      });
    }
  };
}

// TODO: this whole thing will be refactored
function updateUniverseIfForkingDataChanged(
  dispatch: ThunkDispatch<void, any, Action>,
  oldUniverseData: Universe,
  universeData: Partial<Universe>
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

export function getUniverseProperties(callback: Function | null = null) {
  return async (dispatch: ThunkDispatch<void, any, Action>) => {
    const openInterest = await getOpenInterestInAttoCash();
    const forkThreshold = await getDisputeThresholdForFork();
    const universeData = { openInterest, forkThreshold };
    dispatch(updateUniverse(universeData));
    if (callback) callback(universeData);
  };
}

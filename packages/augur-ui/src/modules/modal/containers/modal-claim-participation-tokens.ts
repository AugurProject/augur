import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { AppState } from 'store';
import { getGasPrice } from 'modules/auth/selectors/get-gas-price';
import {
  formatGasCostToEther,
  formatAttoRep,
  formatAttoDai,
} from 'utils/format-number';
import { closeModal } from 'modules/modal/actions/close-modal';
import { Proceeds } from 'modules/modal/proceeds';
import { ActionRowsProps } from 'modules/modal/common';
import {
  redeemStake,
  redeemStakeBatches,
} from 'modules/reporting/actions/claim-reporting-fees';
import {
  CLAIM_FEE_WINDOWS,
  CLAIM_STAKE_FEES,
  CLAIM_FEES_GAS_COST,
  ZERO,
} from 'modules/common/constants';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';
import { MarketReportClaimableContracts } from 'modules/types';
import { disavowMarket } from 'modules/contracts/actions/contractCalls';
import { selectReportingWinningsByMarket } from 'modules/positions/selectors/select-reporting-winnings-by-market';
import { displayGasInDai } from 'modules/app/actions/get-ethToDai-rate';

const mapStateToProps = (state: AppState) => {
  return {
    modal: state.modal,
    gasCost: formatGasCostToEther(
      CLAIM_FEES_GAS_COST,
      { decimalsRounded: 4 },
      getGasPrice(state)
    ),
    Gnosis_ENABLED: state.appStatus.gnosisEnabled,
    ethToDaiRate: state.appStatus.ethToDaiRate,
    pendingQueue: state.pendingQueue || [],
    claimReportingFees: selectReportingWinningsByMarket(state),
    forkingInfo: state.universe.forkingInfo,
  }
}

const mapDispatchToProps = (dispatch: ThunkDispatch<void, any, Action>) => ({
  closeModal: () => dispatch(closeModal()),
  redeemStake: (options, callback) => redeemStake(options, callback),
  disavowMarket: marketId => disavowMarket(marketId),
});

const mergeProps = (sP: any, dP: any, oP: any) => {
  const isForking = !!sP.forkingInfo;
  const { gasCost, pendingQueue } = sP;
  const claimReportingFees = sP.claimReportingFees as MarketReportClaimableContracts;
  const modalRows: ActionRowsProps[] = [];

  let redeemStakeOptions;
  if (claimReportingFees.participationContracts.unclaimedRep.gt(ZERO)) {
    const disputeWindowsPending =
      pendingQueue[CLAIM_STAKE_FEES] &&
      pendingQueue[CLAIM_STAKE_FEES][CLAIM_FEE_WINDOWS];

    const repFormatted = formatAttoRep(
      claimReportingFees.participationContracts.unclaimedRep
    );
    const daiFormatted = formatAttoDai(
      claimReportingFees.participationContracts.unclaimedDai
    );
    modalRows.push({
      title: isForking
        ? 'Release Participation REP'
        : 'Reedeem all participation tokens',
      text: 'Claim',
      status: disputeWindowsPending,
      properties: [
        {
          label: 'Reporting Stake',
          value: `${repFormatted.formatted} REP`,
          addExtraSpace: true,
        },
        {
          label: 'Reporting Fees',
          value: `$${daiFormatted.formatted}`,
        },
        {
          label: 'Transaction Fee',
          value: sP.Gnosis_ENABLED ? displayGasInDai(gasCost, sP.ethToDaiRate) : gasCost + ' ETH',
        },
      ],
      action: () => {
        redeemStakeOptions = {
          disputeWindows: claimReportingFees.participationContracts.contracts,
          reportingParticipants: [],
        };
        dP.redeemStake(redeemStakeOptions);
      },
    });
  }
  const submitAllTxCount = redeemStakeOptions ? redeemStakeBatches(redeemStakeOptions) : 0;

  if (modalRows.length === 0) {
    dP.closeModal();
    return {};
  }

  return {
    title: isForking ? 'Release REP' : 'Claim Fees',
    submitAllTxCount: isForking ? 0 : submitAllTxCount,
    descriptionMessage: [
      {
        preText: 'You have',
        boldText: `${claimReportingFees.totalUnclaimedDaiFormatted.formatted} DAI`,
        postText: 'of reporting fees to collect from the following markets:',
      },
    ],
    rows: modalRows,
    closeAction: () => {
      if (sP.modal.cb) {
        sP.modal.cb();
      }
      dP.closeModal();
    },
    buttons: []
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
    mergeProps
  )(Proceeds)
);

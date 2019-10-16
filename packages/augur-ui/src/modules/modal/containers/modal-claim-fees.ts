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
  CLAIM_FEES_GAS_COST,
  redeemStake,
  redeemStakeBatches,
} from 'modules/reporting/actions/claim-reporting-fees';
import {
  CLAIM_FEE_WINDOWS,
  CLAIM_STAKE_FEES,
  ZERO,
} from 'modules/common/constants';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';
import { MarketReportClaimableContracts } from 'modules/types';
import { disavowMarket } from 'modules/contracts/actions/contractCalls';

const mapStateToProps = (state: AppState, ownProps) => ({
  modal: state.modal,
  gasCost: formatGasCostToEther(
    CLAIM_FEES_GAS_COST,
    { decimalsRounded: 4 },
    getGasPrice(state)
  ),
  pendingQueue: state.pendingQueue || [],
  claimReportingFees: ownProps,
  forkingInfo: state.universe.forkingInfo,
});

const mapDispatchToProps = (dispatch: ThunkDispatch<void, any, Action>) => ({
  closeModal: () => dispatch(closeModal()),
  redeemStake: (options, callback) => redeemStake(options, callback),
  disavowMarket: marketId => disavowMarket(marketId),
});

const mergeProps = (sP: any, dP: any, oP: any) => {
  const isForking = !!sP.forkingInfo;
  const forkingMarket = isForking ? sP.forkingInfo.forkingMarket : undefined;
  const { gasCost, pendingQueue } = sP;
  const claimReportingFees = sP.claimReportingFees as MarketReportClaimableContracts;
  const modalRows: ActionRowsProps[] = [];

  const reportingParticipants = claimReportingFees.claimableMarkets.marketContracts.reduce(
    (p, c) => [...p, ...c.contracts],
    []
  );
  const AllRedeemStakeOptions = {
    disputeWindows: claimReportingFees.participationContracts.contracts,
    reportingParticipants,
  };
  const submitAllTxCount = redeemStakeBatches(AllRedeemStakeOptions);
  const claimableMarkets = claimReportingFees.claimableMarkets;
  claimableMarkets.marketContracts.map(marketObj => {
    const market = marketObj.marketObject;
    if (market) {
      const marketRep = formatAttoRep(marketObj.totalAmount);
      const isForkingMarket = market.id === forkingMarket;

      const pending =
        pendingQueue[CLAIM_STAKE_FEES] &&
        pendingQueue[CLAIM_STAKE_FEES][marketObj.marketId];
      const RedeemStakeOptions = {
        disputeWindows: [],
        reportingParticipants: marketObj.contracts,
        disavowed: market.disavowed ? true : false,
        isForkingMarket,
      };
      const marketTxCount = redeemStakeBatches(RedeemStakeOptions);
      let notice = undefined;
      let action = () => dP.redeemStake(RedeemStakeOptions);
      let buttonText = 'Claim Proceeds';

      if (isForking) {
        if (!market.disavowed) {
          buttonText = 'Disavow Market REP';
          notice = `Disavow Market disputing REP in order to release REP, releasing REP will be in a separate transaction`;
          action = () => dP.disavowMarket(market.id);
        } else if (market.disavowed && marketTxCount > 1) {
          notice = `Releasing REP will take ${marketTxCount} Transactions`;
          buttonText = 'Release REP';
        }

        if (isForkingMarket) {
          buttonText = 'Release and Migrate REP';
          action = () => dP.redeemStake(RedeemStakeOptions);
          notice =
            marketTxCount > 1
              ? `Forking market, releasing REP will take ${marketTxCount} Transactions and be sent to corresponding child universe`
              : `Forking market, release REP will be sent to corresponding child universe`;
        }
      }

      if (market.disavowed) buttonText = 'Release REP';
      modalRows.push({
        title: market.description,
        text: buttonText,
        status: pending && pending.status,
        notice,
        marketTxCount,
        properties: [
          {
            label: 'reporting stake',
            value: `${marketRep.formatted || 0} REP`,
            addExtraSpace: true,
          },
          {
            label: 'est gas cost',
            value: `${gasCost} ETH`,
          },
        ],
        action,
      });
    }
  });
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
          value: `${daiFormatted.formatted} DAI`,
        },
        {
          label: 'Est Gas cost',
          value: `${gasCost} ETH`,
        },
      ],
      action: () => {
        const RedeemStakeOptions = {
          disputeWindows: claimReportingFees.participationContracts.contracts,
          reportingParticipants: [],
        };
        dP.redeemStake(RedeemStakeOptions);
      },
    });
  }
  return {
    title: isForking ? 'Release REP' : 'Claim Stake & Fees',
    submitAllTxCount: isForking ? 0 : submitAllTxCount,
    descriptionMessage: [
      {
        preText: 'You have',
        boldText: `${claimReportingFees.totalUnclaimedRepFormatted.formatted} REP`,
        postText: 'available to be claimed from your reporting stake ',
      },
      {
        preText: ' and',
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
    buttons: isForking
      ? []
      : [
          {
            text: 'Claim All',
            disabled: modalRows.find(market => market.status === 'pending'),
            action: () => {
              dP.redeemStake(AllRedeemStakeOptions, () => {
                if (sP.modal.cb) {
                  sP.modal.cb();
                }
              });
              dP.closeModal();
            },
          },
          {
            text: 'Close',
            action: () => {
              if (sP.modal.cb) {
                sP.modal.cb();
              }
              dP.closeModal();
            },
          },
        ],
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
    mergeProps
  )(Proceeds)
);

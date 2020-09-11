import { connect } from 'react-redux';
import { FeePoolView } from 'modules/reporting/common';
import { updateModal } from 'modules/modal/actions/update-modal';
import { MODAL_CLAIM_FEES, MODAL_STAKE_TOKENS, REP, SREP, ZERO } from 'modules/common/constants';
import { formatAttoDai, formatAttoRep, formatPercent, formatRep, } from 'utils/format-number';
import { createBigNumber } from 'utils/create-big-number';
import { AppState } from 'appStore';

const mapStateToProps = (state: AppState) => {
  const isLoggedIn = state.authStatus.isLogged;
  const { address, fees, purchased } =
    state.universe && state.universe.disputeWindow;
  const disablePurchaseButton = !!state.universe.forkingInfo;
  const { participationTokens } =
    state.loginAccount && state.loginAccount.reporting;
  const { balances } = state.loginAccount;
  const tokenAmount =
    (address &&
      participationTokens &&
      (participationTokens.contracts.find(c => !c.isClaimable) || {}).amount) ||
    ZERO;
  const purchasedTokens = purchased || 0;
  const purchasedParticipationTokens = formatAttoRep(purchasedTokens);
  const ONE_HUNDRED_BECAUSE_PERCENTAGES = 100;
  const percentageOfTotalFees = formatPercent(
    purchasedParticipationTokens.value
      ? createBigNumber(tokenAmount)
          .dividedBy(createBigNumber(purchasedTokens))
          .times(ONE_HUNDRED_BECAUSE_PERCENTAGES)
      : 0
  );
  const pastParticipationTokensPurchased =
    (participationTokens && createBigNumber(participationTokens.totalClaimable)) || ZERO;

  const participationTokensClaimableFees = participationTokens && participationTokens.contracts
    ? participationTokens.contracts
        .filter(c => c.isClaimable)
        .map(c => c.amountFees)
        .reduce((accumulator, currentValue) => {
          const bigAccumulator = createBigNumber(accumulator) || ZERO;
          const bigCurrentValue = createBigNumber(currentValue) || ZERO;
          return bigCurrentValue.plus(bigAccumulator);
        }, ZERO)
    : ZERO;

  const hasRedeemable = isLoggedIn && pastParticipationTokensPurchased.gt(ZERO);

  return {
    disputeWindowFees: formatAttoDai(fees || 0),
    purchasedParticipationTokens,
    tokensOwned: formatAttoRep(tokenAmount),
    percentageOfTotalFees,
    pastParticipationTokensPurchased: formatAttoRep(pastParticipationTokensPurchased),
    participationTokensClaimableFees: formatAttoDai(participationTokensClaimableFees),
    disablePurchaseButton,
    hasRedeemable,
    balances,
  };
};

const mapDispatchToProps = dispatch => ({
  openModal: (modal) => dispatch(updateModal({ type: MODAL_STAKE_TOKENS, modal })),
  openClaimParticipationTokensModal: () => dispatch(updateModal({type: MODAL_CLAIM_FEES, participationTokensOnly: true}))
});


const mergeProps = (sP: any, dP: any, oP: any) => {
  const rep = sP.balances.rep;
  const srep = sP.balances.feePool.stakedRep;
  const sRepFormatted = formatRep(srep);
  // TODO: get governance tokens balance
  const gRepFormatted = formatRep('0'); //sP.balances

  return {
    sRepFormatted,
    gRepFormatted,
    ...sP,
    ...dP,
    ...oP,
    openStakeRepModal: () => dP.openModal({ tokenName: REP, balance: rep}),
    openStakeSrepModal: () => dP.openModal({ tokenName: SREP, balance: srep}),
    openClaimFeesModal: () => dP.openClaimParticipationTokensModal(),
    openExitFeePoolModal: () => dP.openClaimParticipationTokensModal(),
    openUnstakeSrepModal: () => dP.openClaimParticipationTokensModal(),
  }
};

const FeePoolViewContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps,
)(FeePoolView);

export default FeePoolViewContainer;

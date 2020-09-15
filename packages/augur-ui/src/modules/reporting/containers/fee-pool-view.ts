import { connect } from 'react-redux';
import { FeePoolView } from 'modules/reporting/common';
import { updateModal } from 'modules/modal/actions/update-modal';
import { ETH, FEE_POOL_CLAIMING, MODAL_ADD_FUNDS, MODAL_CLAIM_FEES, MODAL_STAKE_TOKENS, REP, SREP, ZERO } from 'modules/common/constants';
import { formatAttoDai, formatAttoRep, formatPercent, formatRep, } from 'utils/format-number';
import { createBigNumber } from 'utils/create-big-number';
import { AppState } from 'appStore';

const mapStateToProps = (state: AppState) => {
  const blockNumber = state.blockchain.currentBlockNumber;
  const gasPrice = state.gasPriceInfo.userDefinedGasPrice || state.gasPriceInfo.average;
  const isLoggedIn = state.authStatus.isLogged;
  const isConnected = state.connection.isConnected;
  const { participationTokens } =
    state.loginAccount && state.loginAccount.reporting;
  const { balances } = state.loginAccount;
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
    pastParticipationTokensPurchased: formatAttoRep(pastParticipationTokensPurchased),
    participationTokensClaimableFees: formatAttoDai(participationTokensClaimableFees),
    hasRedeemable,
    balances,
    account: state.loginAccount.address,
    isLoggedIn,
    gasPrice,
    isConnected,
    blockNumber,
  };
};

const mapDispatchToProps = dispatch => ({
  openModal: (modal) => dispatch(updateModal({ type: MODAL_STAKE_TOKENS, modal })),
  openClaimParticipationTokensModal: () => dispatch(updateModal({type: MODAL_CLAIM_FEES, participationTokensOnly: true})),
  showAddFundsModal: () => dispatch(updateModal({ type: MODAL_ADD_FUNDS, tokenToAdd: ETH })),
  showFeePoolClaiming: (modal) => dispatch(updateModal({ type: FEE_POOL_CLAIMING, modal }))
});


const mergeProps = (sP: any, dP: any, oP: any) => {
  const rep = sP.balances.rep;

  return {
    ...sP,
    ...dP,
    ...oP,
    openStakeRepModal: () => dP.openModal({ tokenName: REP, balance: rep}),
    openStakeSrepModal: (srep) => dP.openModal({ tokenName: SREP, balance: srep}),
    openUnstakeSrepModal: () => dP.openClaimParticipationTokensModal(),
    openExitUnstakeGovModal: () => dP.openClaimParticipationTokensModal(),
    showFeePoolClaiming: (totalFees, srep) => dP.showFeePoolClaiming({ totalRep: srep, totalFees }),
    showFeePoolExitClaiming: (totalFees, srep) => dP.showFeePoolClaiming({ totalRep: srep, totalFees, isFullExit: true })
  }
};

const FeePoolViewContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps,
)(FeePoolView);

export default FeePoolViewContainer;

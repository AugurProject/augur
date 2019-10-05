import { connect } from 'react-redux';
import { ParticipationTokensView } from 'modules/reporting/common';
import { updateModal } from "modules/modal/actions/update-modal";
import { MODAL_PARTICIPATE, ZERO } from 'modules/common/constants';
import { formatAttoDai, formatAttoRep, formatPercent } from "utils/format-number";
import { createBigNumber } from 'utils/create-big-number';
import { AppState } from 'store';

const mapStateToProps = (state: AppState) => {
  const {address, fees, purchased} = state.universe && state.universe.disputeWindow;
  const {participationTokens} = state.loginAccount && state.loginAccount.reporting;
  const tokenAmount = address && participationTokens && (participationTokens.contracts.find(c => !c.isClaimable) || {}).amount || ZERO;
  const purchasedTokens = purchased || 0;
  const purchasedParticipationTokens = formatAttoRep(purchasedTokens);
  const ONE_HUNDRED_BECAUSE_PERCENTAGES = 100;
  const percentageOfTotalFees = formatPercent(purchasedParticipationTokens.value ? createBigNumber(tokenAmount).dividedBy(createBigNumber(purchasedTokens)).times(ONE_HUNDRED_BECAUSE_PERCENTAGES) : 0);
  const participationTokensClaimable = participationTokens && participationTokens.totalClaimable || ZERO;
  const participationTokensClaimableFees = participationTokens && participationTokens.totalFees || ZERO;

  return {
    disputeWindowFees: formatAttoDai(fees || 0),
    purchasedParticipationTokens,
    tokensOwned: formatAttoRep(tokenAmount),
    percentageOfTotalFees,
    participationTokensClaimable: formatAttoRep(participationTokensClaimable),
    participationTokensClaimableFees: formatAttoDai(participationTokensClaimableFees),
  };
};

const mapDispatchToProps = dispatch => ({
  openModal: () => dispatch(updateModal({ type: MODAL_PARTICIPATE })),
});

const ParticipationTokensViewContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(ParticipationTokensView);

export default ParticipationTokensViewContainer;

import { connect } from 'react-redux';
import { ParticipationTokensView } from 'modules/reporting/common';
import { updateModal } from "modules/modal/actions/update-modal";
import { MODAL_PARTICIPATE } from 'modules/common/constants';
import { formatAttoDai, formatAttoRep, formatPercent } from "utils/format-number";
import { createBigNumber } from 'utils/create-big-number';

const mapStateToProps = state => {
  const disputeWindow = state.universe.disputeWindow;
  const participationTokens = state.loginAccount && state.loginAccount.reporting.participationTokens;
  const tokenAmount = disputeWindow && participationTokens ? (participationTokens.contracts.find(contract => contract.address === disputeWindow.address) || {}).amount || 0 : 0;
  const purchasedTokens = state.universe && state.universe.disputeWindow ? state.universe.disputeWindow.purchased : 0;
  const purchasedParticipationTokens = formatAttoRep(purchasedTokens);
  const totalAmount = participationTokens && participationTokens.totalAmount || 0;
  const percentageOfTotalFees = formatPercent(purchasedParticipationTokens.value ? createBigNumber(totalAmount).dividedBy(createBigNumber(purchasedTokens)) : 0);
  return {
    disputeWindowFees: formatAttoDai(state.universe && state.universe.disputeWindow ? state.universe.disputeWindow.fees : 0),
    purchasedParticipationTokens,
    tokensOwned: formatAttoRep(tokenAmount),
    participationTokens,
    disputeWindow,
    percentageOfTotalFees,
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

import { connect } from 'react-redux';
import { ParticipationTokensView } from 'modules/reporting/common';
import { updateModal } from "modules/modal/actions/update-modal";
import { MODAL_PARTICIPATE } from 'modules/common/constants';
import { formatAttoDai, formatAttoRep } from "utils/format-number";

const mapStateToProps = state => {
  const disputeWindow = state.universe.disputeWindow && state.universe.disputeWindow.address;
  const participationTokens = state.loginAccount && state.loginAccount.reporting.participationTokens;
  const tokenAmount = disputeWindow && participationTokens ? (participationTokens.contracts.find(contract => contract.address === disputeWindow) || {}).amount || 0 : 0;
  return {
    disputeWindowFees: formatAttoDai(state.universe && state.universe.disputeWindow ? state.universe.disputeWindow.fees : 0),
    purchasedParticipationTokens: formatAttoRep(state.universe && state.universe.disputeWindow ? state.universe.disputeWindow.purchased : 0),
    tokensOwned: formatAttoRep(tokenAmount),
    participationTokens,
  };
};

const mapDispatchToProps = dispatch => ({
  openModal: () => dispatch(updateModal({ type: MODAL_PARTICIPATE })),
});

const ParticipationTokensViewContaineer = connect(
  mapStateToProps,
  mapDispatchToProps
)(ParticipationTokensView);

export default ParticipationTokensViewContaineer;

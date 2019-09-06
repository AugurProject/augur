import { connect } from 'react-redux';
import { ParticipationTokensView } from 'modules/reporting/common';
import { updateModal } from "modules/modal/actions/update-modal";
import { MODAL_PARTICIPATE } from 'modules/common/constants';
import { formatNumber, formatDai } from "utils/format-number";

const mapStateToProps = state => {
  const disputeWindow = state.universe.disputeWindow && state.universe.disputeWindow.address;
  const pariticipationTokens = state.loginAccount && state.loginAccount.reporting.pariticipationTokens;
  return {
    disputeWindowFees: formatDai(state.universe && state.universe.disputeWindow ? state.universe.disputeWindow.fees : 0),
    purchasedParticipationTokens: formatNumber(state.universe && state.universe.disputeWindow ? state.universe.disputeWindow.purchased : 0),
    tokensOwned: formatNumber(pariticipationTokens ? pariticipationTokens.contracts.find(contract => contract.address === disputeWindow).amount : 0),
    pariticipationTokens: pariticipationTokens,
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

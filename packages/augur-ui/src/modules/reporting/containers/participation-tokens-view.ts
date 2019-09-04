import { connect } from 'react-redux';
import { ParticipationTokensView } from 'modules/reporting/common';
import { updateModal } from "modules/modal/actions/update-modal";
import { MODAL_PARTICIPATE } from 'modules/common/constants';
import { formatNumber, formatDai } from "utils/format-number";

const mapStateToProps = state => {
  return {
    disputeWindowFees: formatDai(state.universe.disputeWindow.fees),
    purchasedParticipationTokens: formatNumber(state.universe.disputeWindow.purchased),
    reporting: state.loginAccount.reporting,
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

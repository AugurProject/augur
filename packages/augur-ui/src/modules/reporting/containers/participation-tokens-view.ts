import { connect } from 'react-redux';
import { ParticipationTokensView } from 'modules/reporting/common';
import { updateModal } from "modules/modal/actions/update-modal";
import { MODAL_PARTICIPATE } from 'modules/common/constants';
import { formatAttoDai, formatAttoRep, formatPercent } from "utils/format-number";
import { createBigNumber } from 'utils/create-big-number';

const mapStateToProps = state => {
  const {address, fees, purchased} = state.universe && state.universe.disputeWindow;
  const {participationTokens} = state.loginAccount && state.loginAccount.reporting;
  const tokenAmount = address && participationTokens ? (participationTokens.contracts.find(contract => contract.address === address) || {}).amount || 0 : 0;
  const purchasedTokens = purchased || 0;
  const purchasedParticipationTokens = formatAttoRep(purchasedTokens);
  const ONE_HUNDRED_BECAUSE_PERCENTAGES = 100;
  const percentageOfTotalFees = formatPercent(purchasedParticipationTokens.value ? createBigNumber(tokenAmount).dividedBy(createBigNumber(purchasedTokens)).times(ONE_HUNDRED_BECAUSE_PERCENTAGES) : 0);
  return {
    disputeWindowFees: formatAttoDai(fees || 0),
    purchasedParticipationTokens,
    tokensOwned: formatAttoRep(tokenAmount),
    participationTokens,
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

import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { submitNewMarket } from 'modules/markets/actions/submit-new-market';
import { updateNewMarket } from 'modules/markets/actions/update-new-market';
import Review from 'modules/create-market/components/review';
import { getGasPrice } from 'modules/auth/selectors/get-gas-price';
import { estimateSubmitNewMarket } from 'modules/markets/actions/estimate-submit-new-market';
import { formatDai, formatRep, formatEther } from 'utils/format-number';
import { AppState } from 'store';

const mapStateToProps = (state: AppState) => {
  const { loginAccount, appStatus } = state;
  return {
    newMarket: state.newMarket,
    currentTimestamp: state.blockchain.currentAugurTimestamp,
    address: loginAccount.address,
    gasPrice: getGasPrice(state),
    availableEthFormatted: formatEther(state.loginAccount.balances.eth),
    availableRepFormatted: formatRep(state.loginAccount.balances.rep),
    availableDaiFormatted: formatDai(state.loginAccount.balances.dai),
    Gnosis_ENABLED: appStatus.gnosisEnabled,
    ethToDaiRate: appStatus.ethToDaiRate,
  }
};

const mapDispatchToProps = dispatch => ({
  updateNewMarket: data => dispatch(updateNewMarket(data)),
  submitNewMarket: (data, cb) => dispatch(submitNewMarket(data, cb)),
  estimateSubmitNewMarket: (data, callback) =>
    estimateSubmitNewMarket(data, callback),
});

const ReviewContainer = withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Review)
);

export default ReviewContainer;

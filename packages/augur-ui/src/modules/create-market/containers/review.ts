import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { submitNewMarket } from 'modules/markets/actions/submit-new-market';
import { updateNewMarket } from 'modules/markets/actions/update-new-market';
import Review from 'modules/create-market/components/review';
import { estimateSubmitNewMarket } from 'modules/markets/actions/estimate-submit-new-market';
import { formatDai, formatRep, formatEther } from 'utils/format-number';
import { AppState } from 'appStore';
import { totalTradingBalance } from 'modules/auth/selectors/login-account';
import { updateModal } from 'modules/modal/actions/update-modal';
import { MODAL_ADD_FUNDS, DAI } from 'modules/common/constants';
import { AppStatusState } from 'modules/app/store/app-status';


const mapStateToProps = (state: AppState) => {
  const { loginAccount, newMarket, blockchain } = state;
  const { gasPriceInfo } = AppStatusState.get();
  return {
    newMarket: newMarket,
    currentTimestamp: blockchain.currentAugurTimestamp,
    address: loginAccount.address,
    gasPrice: gasPriceInfo.userDefinedGasPrice || gasPriceInfo.average,
    availableEthFormatted: formatEther(loginAccount.balances.eth),
    availableRepFormatted: formatRep(loginAccount.balances.rep),
    availableDaiFormatted: formatDai(
      totalTradingBalance(loginAccount)
    ),
  };
};

const mapDispatchToProps = dispatch => ({
  showAddFundsModal: (fundType = DAI) => dispatch(updateModal({ type: MODAL_ADD_FUNDS, fundType })),
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

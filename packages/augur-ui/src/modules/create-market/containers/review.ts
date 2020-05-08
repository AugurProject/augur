import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { submitNewMarket } from 'modules/markets/actions/submit-new-market';
import { updateNewMarket } from 'modules/markets/actions/update-new-market';
import Review from 'modules/create-market/components/review';
import { estimateSubmitNewMarket } from 'modules/markets/actions/estimate-submit-new-market';
import { formatDai, formatRep, formatEther } from 'utils/format-number';
import { AppState } from 'appStore';
import { totalTradingBalance } from 'modules/auth/helpers/login-account';
import { MODAL_ADD_FUNDS, DAI } from 'modules/common/constants';
import { AppStatus } from 'modules/app/store/app-status';

const mapStateToProps = (state: AppState) => {
  const { newMarket } = state;
  const {
    loginAccount: {
      address,
      balances: { eth, rep },
    },
    gasPriceInfo,
    blockchain: { currentAugurTimestamp: currentTimestamp },
  } = AppStatus.get();
  return {
    newMarket: newMarket,
    currentTimestamp,
    address,
    gasPrice: gasPriceInfo.userDefinedGasPrice || gasPriceInfo.average,
    availableEthFormatted: formatEther(eth),
    availableRepFormatted: formatRep(rep),
    availableDaiFormatted: formatDai(totalTradingBalance()),
  };
};

const mapDispatchToProps = dispatch => {
  const { setModal } = AppStatus.actions;
  return {
    showAddFundsModal: (fundType = DAI) =>
      setModal({ type: MODAL_ADD_FUNDS, fundType }),
    updateNewMarket: data => dispatch(updateNewMarket(data)),
    submitNewMarket: (data, cb) => dispatch(submitNewMarket(data, cb)),
    estimateSubmitNewMarket: (data, callback) =>
      estimateSubmitNewMarket(data, callback),
  };
};

const ReviewContainer = withRouter(
  connect(mapStateToProps, mapDispatchToProps)(Review)
);

export default ReviewContainer;

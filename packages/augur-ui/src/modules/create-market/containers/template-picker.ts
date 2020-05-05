import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import {
  updateNewMarket,
  clearNewMarket,
} from 'modules/markets/actions/update-new-market';
import { TemplatePicker } from 'modules/create-market/components/template-picker';
import { AppStatus } from 'modules/app/store/app-status';

const mapStateToProps = state => {
  const {
    loginAccount: { address },
    blockchain: { currentAugurTimestamp: currentTimestamp },
  } = AppStatus.get();
  return {
    newMarket: state.newMarket,
    currentTimestamp,
    address,
  };
};
const mapDispatchToProps = dispatch => ({
  updateNewMarket: data => dispatch(updateNewMarket(data)),
  clearNewMarket: () => dispatch(clearNewMarket()),
});

const TemplatePickerContainer = withRouter(
  connect(mapStateToProps, mapDispatchToProps)(TemplatePicker)
);

export default TemplatePickerContainer;

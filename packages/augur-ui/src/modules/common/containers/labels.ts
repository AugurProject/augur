import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { InvalidLabel } from 'modules/common/labels';
import { MODAL_INVALID_MARKET_RULES, } from 'modules/common/constants';
import { updateModal } from 'modules/modal/actions/update-modal';

const mapDispatchToProps = dispatch => ({
  openInvalidMarketRulesModal: () => dispatch(updateModal({type: MODAL_INVALID_MARKET_RULES})),
});

const InvalidLabelContainer = withRouter(
  connect(
    null,
    mapDispatchToProps
  )(InvalidLabel)
);

export default InvalidLabelContainer;

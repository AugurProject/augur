import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import MarketRow from 'modules/portfolio/components/common/market-row';
import { MODAL_UNSIGNED_ORDERS } from 'modules/common/constants';
import { AppStatus } from 'modules/app/store/app-status';

const mapStateToProps = (state: AppState) => ({});

const mapDispatchToProps = dispatch => ({
  unsignedOrdersModal: (marketId: string, cb: Function) =>
    AppStatus.actions.setModal({
      type: MODAL_UNSIGNED_ORDERS,
      marketId,
      cb,
    }),
});

const mergeProps = (sP: any, dP: any, oP: any) => ({
  ...oP,
  ...sP,
  ...dP,
});

const MarketRowContainer = withRouter(
  connect(mapStateToProps, mapDispatchToProps, mergeProps)(MarketRow)
);

export default MarketRowContainer;

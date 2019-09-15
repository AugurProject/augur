import { connect } from 'react-redux';
import { Paginator } from 'modules/reporting/reporting-list';

import {
  loadOpenReportingMarkets,
  loadUpcomingDesignatedReportingMarkets,
  loadDesignatedReportingMarkets,
} from 'modules/markets/actions/load-markets';
import { REPORTING_STATE } from 'modules/common/constants';
import { selectReportingMarkets } from 'modules/markets/selectors/select-reporting-markets';

const mapStateToProps = (state, ownProps) => ({
  isLogged: state.authStatus.isLogged,
  isConnected: state.connection.isConnected,
  markets: selectReportingMarkets(state, ownProps.reportingType)
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  loadMarkets: (offset, limit, type, cb) => {
    switch (type) {
      case REPORTING_STATE.DESIGNATED_REPORTING:
        dispatch(loadDesignatedReportingMarkets({ offset, limit }, cb));
        break;
      case REPORTING_STATE.PRE_REPORTING:
        dispatch(loadUpcomingDesignatedReportingMarkets({ offset, limit }, cb));
        break;
      default:
        dispatch(loadOpenReportingMarkets({ offset, limit }, cb));
    }
  },
});

const ReportingCardContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Paginator);

export default ReportingCardContainer;

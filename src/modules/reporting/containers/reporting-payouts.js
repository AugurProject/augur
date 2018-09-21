import { connect } from "react-redux";
import MarketReportingPayouts from "modules/reporting/components/reporting-payouts/reporting-payouts";

const mapStateToProps = state => ({
  isMobile: state.appStatus.isMobile,
  isMobileSmall: state.appStatus.isMobileSmall
});

export default connect(mapStateToProps)(MarketReportingPayouts);

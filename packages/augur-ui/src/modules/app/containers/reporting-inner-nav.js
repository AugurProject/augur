import { connect } from "react-redux";
import ReportingInnerNav from "modules/app/components/inner-nav/reporting-inner-nav";

const mapStateToProps = state => ({
  isLogged: state.authStatus.isLogged
});

const ReportingInnerNavContainer = connect(mapStateToProps)(ReportingInnerNav);

export default ReportingInnerNavContainer;

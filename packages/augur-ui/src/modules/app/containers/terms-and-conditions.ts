import { connect } from "react-redux";
import TermsAndConditions from "modules/app/components/terms-and-conditions";
import { AppState } from "appStore";

const mapStateToProps = (state: AppState) => ({});

export default connect(mapStateToProps)(TermsAndConditions);

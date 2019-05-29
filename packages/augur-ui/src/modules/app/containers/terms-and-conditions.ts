import { connect } from "react-redux";
import TermsAndConditions from "modules/app/components/terms-and-conditions";
import { AppState } from "store";

const mapStateToProps = (state: AppState) => ({
  versions: state.versions
});

export default connect(mapStateToProps)(TermsAndConditions);

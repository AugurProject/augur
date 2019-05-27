import { connect } from "react-redux";
import TermsAndConditions from "modules/app/components/terms-and-conditions/terms-and-conditions";

const mapStateToProps = state => ({
  versions: state.versions
});

export default connect(mapStateToProps)(TermsAndConditions);

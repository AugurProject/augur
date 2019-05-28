import { connect } from "react-redux";
import TermsAndConditions from "modules/app/components/terms-and-conditions";

const mapStateToProps = (state: any) => ({
  versions: state.versions
});

export default connect(mapStateToProps)(TermsAndConditions);

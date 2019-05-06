import { connect } from "react-redux";

import OpenOrder from "modules/portfolio/components/common/rows/open-order";

const mapStateToProps = (state: any) => ({
  isMobile: state.appStatus.isMobile
});

export default connect(mapStateToProps)(OpenOrder);

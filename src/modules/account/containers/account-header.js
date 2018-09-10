import { connect } from "react-redux";

import AccountHeader from "modules/account/components/account-header/account-header";

import { selectCoreStats } from "modules/account/selectors/core-stats";

const mapStateToProps = state => {
  const coreStats = selectCoreStats(state);
  return {
    stats: coreStats,
    isMobile: state.isMobile
  };
};

const AccountHeaderContainer = connect(mapStateToProps)(AccountHeader);

export default AccountHeaderContainer;

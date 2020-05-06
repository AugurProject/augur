import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import TopBar from 'modules/app/components/top-bar';
import { selectInfoAlertsAndSeenCount } from 'modules/alerts/selectors/alerts';
import { AppState } from 'appStore';

const mapStateToProps = (state: AppState) => {
  const { unseenCount } = selectInfoAlertsAndSeenCount(state);
  return {
    unseenCount,
  };
};

export default withRouter(
  connect(
    mapStateToProps,
  )(TopBar)
);

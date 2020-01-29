import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import AccountView from 'modules/account/components/account-view';
import { selectNotifications } from 'modules/notifications/selectors/notification-state';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';

// TODO create state Interface
const mapStateToProps = (state: AppState) => {
  const notifications = selectNotifications(state);
  const newNotifications = notifications.filter(item => item.isNew).length > 0;
  return { newNotifications };
};


const AccountViewContainer = withRouter(
  connect(
    mapStateToProps,
  )(AccountView)
);

export default AccountViewContainer;

import isCurrentLoginMessageRead from '../../login-message/helpers/is-current-login-message-read';
import isUserLoggedIn from '../../auth/helpers/is-user-logged-in';

// decide if we need to display the login message
export const displayLoginMessageOrMarkets = () => (dispatch, getState) => {
  const { links } = require('../../../selectors');
  if (links && links.marketsLink) {
    const { loginAccount, loginMessage } = getState();
    if (isUserLoggedIn(loginAccount) && !isCurrentLoginMessageRead(loginMessage)) {
      links.loginMessageLink.onClick();
    } else {
      links.topicsLink.onClick();
    }
  }
};

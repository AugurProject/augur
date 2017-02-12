import isCurrentLoginMessageRead from '../../login-message/helpers/is-current-login-message-read';
import isUserLoggedIn from '../../auth/helpers/is-user-logged-in';

// decide if we need to display the login message
export const displayLoginMessageOrMarkets = account => (dispatch, getState) => {
  const { links } = require('../../../selectors');
  if (links && links.marketsLink) {
    const { loginMessage } = getState();
    if (isUserLoggedIn(account) && !isCurrentLoginMessageRead(loginMessage)) {
      links.loginMessageLink.onClick();
    } else {
      links.marketsLink.onClick();
    }
  }
};

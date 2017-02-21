import isCurrentLoginMessageRead from '../../login-message/helpers/is-current-login-message-read';
import isUserLoggedIn from '../../auth/helpers/is-user-logged-in';

// decide if we need to display the login message
export const displayLoginMessageOrTopics = redirect => (dispatch, getState) => {
  const { links } = require('../../../selectors');
  if (links && links.topicsLink) {
    const { loginAccount, loginMessage } = getState();
    if (isUserLoggedIn(loginAccount) && !isCurrentLoginMessageRead(loginMessage)) {
      links.loginMessageLink.onClick();
    } else if (redirect) {
      links.topicsLink.onClick();
    }
  }
};

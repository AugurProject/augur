import { UPDATE_LOGIN_MESSAGE_VERSION_READ } from '../../login-message/actions/update-user-login-message-version-read';

export default function (loginMessage = { version: 1 }, action) {
	switch (action.type) {
		case UPDATE_LOGIN_MESSAGE_VERSION_READ:
			return {
				...loginMessage,
				userVersionRead: action.loginMessageVersion
			};
		default:
			return loginMessage;
	}
}

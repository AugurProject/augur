export const UPDATE_LOGIN_MESSAGE_VERSION_READ = 'UPDATE_LOGIN_MESSAGE_VERSION_READ';

export default function (loginMessageVersion) {
	return {
		type: UPDATE_LOGIN_MESSAGE_VERSION_READ,
		loginMessageVersion
	};
}

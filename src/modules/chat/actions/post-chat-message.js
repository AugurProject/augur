import { augur } from '../../../services/augurjs';

export function postChatMessage(roomName, message) {
	return (dispatch, getState) => {
		const { loginAccount } = getState();
		if (loginAccount.id) {
			augur.chat.postMessage(roomName, message, loginAccount.id, loginAccount.name, (err) => {
				if (err) console.error('couldn\'t post chat message: ' + message, err);
			});
		}
	};
}

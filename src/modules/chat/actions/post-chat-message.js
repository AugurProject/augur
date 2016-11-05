import { augur } from '../../../services/augurjs';

export function postChatMessage(roomName, message) {
	return (dispatch, getState) => {
		const { loginAccount } = getState();
		let senderAddress;
		let senderName;
		if (loginAccount.id) {
			senderAddress = loginAccount.id;
			senderName = loginAccount.name || '';
		} else {
			senderAddress = '0x0';
			senderName = 'Anonymous Coward';
		}
		augur.chat.postMessage(roomName, message, senderAddress, senderName, (err) => {
			if (err) console.error('couldn\'t post chat message: ' + message, err);
		});
	};
}

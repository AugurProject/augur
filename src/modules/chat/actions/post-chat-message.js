import { augur } from '../../../services/augurjs';

export function postChatMessage(roomName, message) {
	return (dispatch, getState) => {
		const { loginAccount } = getState();
		const senderAddress = loginAccount.id || '0x0';
		const senderName = loginAccount.name || loginAccount.id || 'Anonymous Coward';
		augur.chat.postMessage(roomName, message, senderAddress, senderName, (err) => {
			if (err) console.error('couldn\'t post chat message: ' + message, err);
		});
	};
}

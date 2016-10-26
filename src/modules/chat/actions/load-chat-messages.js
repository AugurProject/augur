import { augur } from '../../../services/augurjs';

export const UPDATE_CHAT_MESSAGES = 'UPDATE_CHAT_MESSAGES';

export function updateChatMessages(roomName, messages) {
	return { type: UPDATE_CHAT_MESSAGES, roomName, messages };
}

export function loadChatMessages(roomName) {
	return (dispatch, getState) => {
		augur.chat.joinRoom(roomName, (messages) => {
			dispatch(updateChatMessages(roomName, messages));
		});
	};
}

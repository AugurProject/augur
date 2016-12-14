import { UPDATE_CHAT_MESSAGES } from '../../../modules/chat/actions/load-chat-messages';

export default function (chatMessages = {}, action) {
	switch (action.type) {
		case UPDATE_CHAT_MESSAGES: {
			return {
				...chatMessages,
				[action.roomName]: (chatMessages[action.roomName] || []).concat(action.messages)
			};
		}
		default:
			return chatMessages;
	}
}

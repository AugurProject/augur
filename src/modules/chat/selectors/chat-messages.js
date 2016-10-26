import store from '../../../store';
import { postChatMessage } from '../../chat/actions/post-chat-message';
import { formatDate } from '../../../utils/format-date';

export default function () {
	const { chatMessages } = store.getState();
	const roomNames = Object.keys(chatMessages);
	const numRooms = roomNames.length;
	const chat = {};
	let chatMessage;
	let numMessages;
	for (let i = 0; i < numRooms; ++i) {
		chatMessage = chatMessages[roomNames[i]].slice();
		chatMessage.sort((a, b) => a.timestamp - b.timestamp);
		numMessages = chatMessage.length;
		for (let j = 0; j < numMessages; ++j) {
			chatMessage[j] = {
				...chatMessage[j],
				address: chatMessage[j].address.replace('0x', ''),
				timestamp: formatDate(new Date(chatMessage[j].timestamp))
			};
		}
		chat[roomNames[i]] = {
			messages: chatMessage,
			onSubmitChatMessage: (roomName, message) => store.dispatch(postChatMessage(roomName, message))
		};
	}
	return chat;
}

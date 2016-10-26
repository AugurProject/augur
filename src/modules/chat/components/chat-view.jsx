import React, { Component } from 'react';
import ValueTimestamp from '../../common/components/value-timestamp';

export default class ChatView extends Component {

	static propTypes = {
		onSubmitChatMessage: React.PropTypes.func
	};

	componentWillUpdate() {
		const node = this.refs.chatbox;
		this.shouldScrollBottom = node.scrollTop + node.offsetHeight === node.scrollHeight;
	}

	componentDidUpdate() {
		if (this.shouldScrollBottom) {
			const node = this.refs.chatbox;
			node.scrollTop = node.scrollHeight;
		}
	}

	onSubmitChatMessage = (e) => {
		e.preventDefault();
		const chatMessage = this.refs.chatMessageInput.value;
		if (chatMessage && chatMessage.trim() !== '') {
			this.props.onSubmitChatMessage('augur', chatMessage.trim());
		}
		this.refs.chatMessageForm.reset();
	}

	render() {
		const p = this.props;
		let messageCount = 0;
		const chatMessages = (
			<ul>
				<li>Welcome to Augur!</li>
				{p.messages &&
					p.messages.map((payload) => {
						const key = `${payload.address}_${payload.timestamp.full}_${messageCount}`;
						messageCount += 1;
						let userName;
						let userPopupName;
						if (payload.name === '') {
							userName = payload.address;
							userPopupName = null;
						} else {
							userName = payload.name;
							userPopupName = payload.address;
						}
						return (
							<li key={key}>
								<span title={userPopupName}>{userName}</span> [<small><ValueTimestamp {...payload.timestamp} /></small>]: {payload.message}
							</li>
						);
					})
				}
			</ul>
		);
		return (
			<section className="chat">
				<button
					className="unstyled close-chat-button"
					title="Close chat window"
					onClick={p.toggleChat}
				>
					<i>&#x25BC;</i>
				</button>
				<div id="chatbox" ref="chatbox">
					<div id="babble">
						{chatMessages}
					</div>
				</div>
				<div className="chat-inputs">
					<form ref="chatMessageForm" name="chat-message-form" onSubmit={this.onSubmitChatMessage}>
						<input
							ref="chatMessageInput"
							className="chat-message-input"
							type="text"
							placeholder="Say something!"
						/>
						<button className="chat-message-button">
							Chat
						</button>
					</form>
				</div>
			</section>
		);
	}
}

import React, { Component } from 'react';
import ValueTimestamp from '../../common/components/value-timestamp';

export default class ChatView extends Component {

	static propTypes = {
		onSubmitChatMessage: React.PropTypes.func
	};

	onSubmitChatMessage = (e) => {
		e.preventDefault();
		this.props.onSubmitChatMessage('augur', this.refs.chatMessageInput.value);
		this.refs.chatMessageForm.reset();
	}

	render() {
		const p = this.props;
		const chatMessages = (
			<ul>
				<li>Welcome to Augur!</li>
				{p.messages &&
					p.messages.map((payload) => {
						const key = `${payload.address}_${payload.timestamp.full}`;
						return (
							<li key={key}>
								{payload.name !== '' ? payload.name : payload.address} [<small><ValueTimestamp {...payload.timestamp} /></small>]: {payload.message}
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
				<div id="chatbox">
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

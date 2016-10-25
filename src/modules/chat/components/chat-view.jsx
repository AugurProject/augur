import React, { Component } from 'react';
import Input from '../../common/components/input';
import ValueTimestamp from '../../common/components/value-timestamp';

export default class ChatView extends Component {

	static propTypes = {
		newMessage: React.PropTypes.string,
		onSubmitChatMessage: React.PropTypes.func
	};

	constructor(props) {
		super(props);
		this.state = {
			newMessage: this.props.newMessage
		};
	}

	onSubmitChatMessage = (e) => {
		e.preventDefault();
		this.props.onSubmitChatMessage('augur', this.state.newMessage);
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
					<form name="chat-message-form" onSubmit={this.onSubmitChatMessage}>
						<Input
							className="chat-message-input"
							type="text"
							placeholder="Say something!"
							onChange={newMessage => this.setState({ newMessage })}
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

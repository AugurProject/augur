import React, { Component } from 'react';
import ReactTooltip from 'react-tooltip';
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
			this.props.onSubmitChatMessage('augur', encodeURIComponent(chatMessage.trim()));
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
						let displayName;
						let tooltipID;
						if (payload.name === '') {
							displayName = payload.address;
						} else if (payload.name === 'Anonymous Coward') {
							displayName = payload.name;
						} else {
							displayName = payload.name;
							tooltipID = `${key}-address-tooltip`;
						}
						messageCount += 1;
						if (!tooltipID) {
							return (
								<li key={key}>
									<span>{displayName}</span> [<small><ValueTimestamp {...payload.timestamp} /></small>]: {payload.message}
								</li>
							);
						}
						return (
							<li key={key}>
								<span data-tip data-for={tooltipID}>{displayName}</span> [<small><ValueTimestamp {...payload.timestamp} /></small>]: {decodeURIComponent(payload.message)}
								<ReactTooltip id={tooltipID} type="light" effect="solid" place="top">
									<span className="tooltip-text">{payload.address}</span>
								</ReactTooltip>
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
					data-tip data-for="close-chat-tooltip"
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
						<div className="chat-message-wrapper">
							<input
								ref="chatMessageInput"
								className="chat-message-input"
								type="text"
								placeholder="Say something!"
							/>
							<button className="chat-message-button">
								Chat
							</button>
						</div>
					</form>
				</div>
				<ReactTooltip id="close-chat-tooltip" type="error" effect="solid" place="top">
					<span className="tooltip-text">Close chat window</span>
				</ReactTooltip>
			</section>
		);
	}
}

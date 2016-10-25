import React from 'react';
import Input from '../../common/components/input';

const Chat = p => (
	<section className="chatbox">
		<div id="chat-box">
			<div id="babble">Welcome to Augur!</div>
		</div>
		<Input
			type="text"
			placeholder="What's on your mind? :)"
			onChange={name => this.setState({ name })}
		/>
		<button
			className="button"
			title="Send your message to the chat room"
			onSubmit={() => console.log('lawl')}
		>
			Babble
		</button>
	</section>
);

export default Chat;

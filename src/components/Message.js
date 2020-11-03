import React, { Component } from 'react';
import '../styles/Message.css';

class Message extends Component {
	render() {
		return (
			<div className='Message'>
				<span className='Message__msg'>
					Selected Rocket is not available
				</span>
			</div>
		)
	}
}

export default Message;
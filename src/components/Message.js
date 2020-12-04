import React from 'react';
import '../styles/Message.css';

function Message(props) {
	return (
		<div className='Message'>
			<span className='Message__msg'>
				{props.msg}
			</span>
		</div>
	)
}

export default Message;
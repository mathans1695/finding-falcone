import React from 'react';
import './Message.css';

const Message = (props) => {
	return (
		<div className='Message'>
			<span className='Message__msg'>
				{props.msg}
			</span>
		</div>
	)
}

export default Message;
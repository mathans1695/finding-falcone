import React, { Component } from 'react';
import '../styles/Error.css';

class Error extends Component {
	render() {
		return (
			<div className='Error'>
				<span className='Error__msg'>
					Selected Rocket is not available
				</span>
			</div>
		)
	}
}

export default Error;
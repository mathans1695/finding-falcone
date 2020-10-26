import React, { Component } from 'react';

class Falcone extends Component {
	constructor(props) {
		super(props);
		this.state = {
			resultJSON: '',
			token: '',
			reqBody: {
				token: '',
				planet_names: {},
				vehicle_names: {}
			},
		}
		
		this.handleClick = this.handleClick.bind(this);
	}
	
	handleClick(reqBody) {
		this.props.getResult(reqBody)
			.then(json => console.log(json))
			.catch(err => console.log(err))
	}
	
	render() {
		const { planets, vehicles, token, getResult } = this.props;
		
		const reqBody = {
			"token": token,
			"planet_names": [
				"Donlon",
				"Enchai",
				"Pingasor",
				"Sapir"
			],
			"vehicle_names": [
				"Space pod",
				"Space rocket",
				"Space rocket",
				"Space rocket"
			]
		}
		reqBody.__proto__ = null;
		
		return (
			<div className='Falcone'>
				{/* Header goes here */}
				<button onClick={() => this.handleClick(reqBody)}>Click</button>
				{/* Footer goes here */}
			</div>
		)
	}
}

export default Falcone;
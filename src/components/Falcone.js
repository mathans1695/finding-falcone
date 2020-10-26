import React, { Component } from 'react';

class Falcone extends Component {
	render() {
		const { planets, vehicles } = this.props;
		console.log(planets, vehicles);
		
		return (
			<div className='Falcone'>
				{/* Header goes here */}
				{/* body */}
				{/* Footer goes here */}
			</div>
		)
	}
}

export default Falcone;
import React, { Component } from 'react';

class Falcone extends Component {
	render() {
		const { planets, vehicles } = this.props;
		console.log(planets, vehicles);
		
		return (
			<div className='Falcone'>
				{ planets.map(planet => <p>{planet.name}</p>) }
			</div>
		)
	}
}

export default Falcone;
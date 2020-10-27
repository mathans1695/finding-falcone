import React, { Component } from 'react';

class ChoosePlanet extends Component {
	render() {
		const planets = this.props.planets;
		const options = planets.map(planet => {
			return <option 
						key={planet.name} 
						value={planet.name}
				   >
						{planet.name}
				   </option>
		});
		
		return (
			<div className='CheckBox'>
				<select>
					<option value=''>Choose Planet</option>
					{options}
				</select>
			</div>
		)
	}
}

export default ChoosePlanet;
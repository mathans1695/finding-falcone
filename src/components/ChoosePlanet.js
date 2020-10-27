import React, { Component } from 'react';
import '../styles/ChoosePlanet.css';

class ChoosePlanet extends Component {
	constructor(props) {
		super(props);
		this.state = {
			
		}
	}
	
	render() {
		const planets = this.props.planets;
		const options = planets.map(planet => {
			return <option 
						key={planet.name} 
						value={planet.name}
						className='ChoosePlanet__Option'
				   >
						{planet.name}
				   </option>
		});
		console.log(options);
		
		return (
			<div className='ChoosePlanet'>
				<select
					className='ChoosePlanet__Select'
					onClick={this.handleClick}
					defaultValue='Choose Planet'
				>
					<option 
						value='Choose Planet' 
						className='ChoosePlanet__Option'
						disabled={true}
						hidden={true}
					>Choose Planet
					</option>
					{options}
				</select>
			</div>
		)
	}
}

export default ChoosePlanet;
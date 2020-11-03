import React, { Component } from 'react';
import '../styles/ChoosePlanet.css';

class ChoosePlanet extends Component {
	constructor(props) {
		super(props);
		this.handleChange = this.handleChange.bind(this);
	}
	
	handleChange(e) {
		const id = e.target.parentElement.id;
		let distance;
		for (let i=0; i<e.target.options.length; i++) {
			if(e.target.options[i].selected === true) {
				distance = +e.target.options[i].getAttribute('data-distance');
			}
		}
		
		const value = e.target.value;
		
		// invokes updatePlanet in MissionPlan component
		this.props.updatePlanet(id, value, distance);
	}
	
	render() {
		const { planets, id } = this.props.planets;
		const options = planets.map(planet => {
			return <option 
						key={planet.name} 
						value={planet.name}
						className='ChoosePlanet__Option'
						data-distance={planet.distance}
				   >
						{planet.name}
				   </option>
		});
		
		return (
			<div className='ChoosePlanet' id={id}>
				<select
					className='ChoosePlanet__Select'
					value={this.props.planets.curPlanet}
					onChange={this.handleChange}
				>
					<option 
						value='Choose Planet' 
						className='ChoosePlanet__Option'
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
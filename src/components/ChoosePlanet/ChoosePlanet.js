import React from 'react';
import './ChoosePlanet.css';

function ChoosePlanet(props) {
	function handleChange(e) {
		const id = e.target.parentElement.id;
		const value = e.target.value;
		let distance;
		
		for (let i=0; i<e.target.options.length; i++) {
			if(e.target.options[i].selected === true) {
				distance = +e.target.options[i].getAttribute('data-distance');
			}
		}
		
		// invokes updatePlanet in MissionPlan component
		props.updateListOfPlanets(id, value, distance);
		props.updateListOfVehicles(id, distance);
	}
	
	const { planets, id } = props.planets;
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
				value={props.planets.curPlanet}
				onChange={handleChange}
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

export default ChoosePlanet;
import React from 'react';
import { uuid } from '../helpers';
import '../styles/AssignRocket.css';

function AssignRocket(props) {
	function handleOnValueChange(e) {
		const target = e.target,
			  rocket = target.value,
			  speed = target.getAttribute('data-speed'),
			  planetDistance = props.vehicles.planetDistance,
			  id = target.getAttribute('data-id');
		
		// invokes handleVehicleUpdation method in MissionPlan component
		props.handleVehicleUpdation(id, rocket, speed, planetDistance);
	}
	
	const vehicles = props.vehicles;
		
	// showing vehicles based on the availability 
	const options = vehicles.vehicles.map((vehicle) => {
		const { name, total_no, speed } = vehicle;
		let display = '';
		let key = uuid();
		
		if(vehicle.showAlways) {
			display = (
				<div className='AssignRocket__option' key={key} >
					<input 
						type='radio' 
						value={name} 
						id={key} 
						checked={vehicle.showAlways}
						onChange={handleOnValueChange}
						data-speed={speed}
						data-id={vehicles.id}
					/>
					<label htmlFor={key}>{name} ({total_no})</label>
				</div>
			)
		} else if(vehicle.isPossible || vehicle.total_no > 0) {
			display = (
				<div className='AssignRocket__option' key={key} >
					<input 
						type='radio' 
						value={name} 
						id={key} 
						checked={vehicle.showAlways}
						onChange={handleOnValueChange}
						data-speed={speed}
						data-id={vehicles.id}
					/>
					<label htmlFor={key}>{name} ({total_no})</label>
				</div>
			)
		}
		
		else {
			display = (
				<div  
					className='AssignRocket__option AssignRocket__option--disable'
					key={key}
				>
					<input 
						type='radio'
						id={key} 
						disabled={true}
					/>
					<label htmlFor={key}>{name} ({total_no})</label>
				</div>
			)
		}
		return display;
	});
		
	return (
		<div className='AssignRocket'>
			{options}
		</div>
	)
}

export default AssignRocket;
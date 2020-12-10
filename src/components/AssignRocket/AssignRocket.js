import React from 'react';
import { uuid } from '../../utils/helpers';
import './AssignRocket.css';

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
		
		// vehicle having showAlways property set to true
		// will be shown no matter what
		// options will be checked based on showAlways property 
		// of vehicle
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
		} 
		// disable the vehicle, if not possible to send the rocket
		// disable vehicle not in stock
		else if (!vehicle.total_no > 0 || !vehicle.isPossible) {
			display = (
				<div  
					className='AssignRocket__option AssignRocket__option--disable'
					key={key}
				>
					<input 
						type='radio'
						value={name} 
						id={key} 
						disabled={true}
						checked={vehicle.showAlways}
						onChange={handleOnValueChange}
						data-speed={speed}
						data-id={vehicles.id}
					/>
					<label htmlFor={key}>{name} ({total_no})</label>
				</div>
			)
		}
		else
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
		return display;
	});
		
	return (
		<div className='AssignRocket'>
			{options}
		</div>
	)
}

export default AssignRocket;
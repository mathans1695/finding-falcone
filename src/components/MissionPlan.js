import React from 'react';
import ChoosePlanet from './ChoosePlanet';
import AssignRocket from './AssignRocket';
import '../styles/MissionPlan.css';

function MissionPlan(props) {
	function updatePlanet(id, removePlanet, planetDistance) {
		// invokes updateListOfVehicle and updateListOfPlanets in falcone component
		props.updateListOfPlanets(id, removePlanet, planetDistance);
		props.updateListOfVehicles(id, planetDistance);
	}
	
	function handleVehicleUpdation(id, rocket, speed, planetDistance) {
		// invoke updateVehicle in falcone component
		props.handleRocketChange(id, rocket, speed, planetDistance);
	}
	
	const { listOfPlanets, listOfVehicles, time } = props;
	
	const chooseDestinations = (
		listOfVehicles.map((vehiclesObj, index) => {
			return (
				<div className='MissionPlan__destination' key={index}>
					<h3 className='MissionPlan__title'>Destination-{index+1}</h3>
					<ChoosePlanet 
						planets={listOfPlanets[index]} 
						updatePlanet={updatePlanet} 
					/>
					{
						listOfVehicles[index].isRendered &&
						<AssignRocket 
							vehicles={listOfVehicles[index]}
							handleVehicleUpdation={handleVehicleUpdation}
						/>
					}
				</div>
			)
		})
	)
		
	return (
		<div className='MissionPlan'>
			<p className='MissionPlan__instructions'>Select planets you want to search in:</p>
			<div className='MissionPlan__destinations'>
				{chooseDestinations}
			</div>
			{
				time.length 
				? <div className='MissionPlan__time'>
						Total Time: {
							time.reduce((accumulator, curValue) => accumulator + curValue, 0)
					}
				  </div>
				: <div className='MissionPlan__time'>
							Total Time: 0
				  </div>
			}
		</div>
	)
}

export default MissionPlan;
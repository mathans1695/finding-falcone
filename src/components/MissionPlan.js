import React, { Component } from 'react';
import ChoosePlanet from './ChoosePlanet';
import AssignRocket from './AssignRocket';
import '../styles/MissionPlan.css';

class MissionPlan extends Component {
	constructor(props) {
		super(props);
		this.updatePlanet = this.updatePlanet.bind(this);
		this.handleVehicleUpdation = this.handleVehicleUpdation.bind(this);
	}
	
	updatePlanet(id, removePlanet, planetDistance) {
		const props = this.props;
		
		props.updateListOfPlanets(id, removePlanet, planetDistance);
		props.updateListOfVehicles(id, planetDistance);
	}
	
	handleVehicleUpdation(id, rocket, speed, totalNumber, planetDistance) {
		const props = this.props;
		
		props.updateVehicle(id, rocket, speed, totalNumber, planetDistance);
	}
	
	render() {
		const { listOfPlanets, listOfVehicles } = this.props;
		
		const chooseDestinations = (
			listOfVehicles.map((vehiclesObj, index) => {
				return (
					<div className='MissionPlan__destination' key={index}>
						<h3 className='MissionPlan__title'>Destination-{index+1}</h3>
						<ChoosePlanet 
							planets={listOfPlanets[index]} 
							updatePlanet={this.updatePlanet} 
						/>
						{
							listOfVehicles[index].isRendered &&
							<AssignRocket 
								vehicles={listOfVehicles[index]}
								handleVehicleUpdation={this.handleVehicleUpdation}
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
					this.props.time.length 
					? <div className='MissionPlan__time'>
							Total Time: {
								this.props.time.reduce((accumulator, curValue) => accumulator + curValue, 0)
							}
					  </div>
					: <div className='MissionPlan__time'>
							Total Time: 0
					  </div>
				}
				
			</div>
		)
	}
}

export default MissionPlan;
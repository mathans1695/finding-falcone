import React, { Component } from 'react';
import { uuid } from '../helpers';
import ListOfPlanets from './ListOfPlanets';
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
		
		// invokes updateListOfVehicle and updateListOfPlanets in falcone component
		props.updateListOfPlanets(id, removePlanet, planetDistance);
		props.updateListOfVehicles(id, planetDistance);
	}
	
	handleVehicleUpdation(id, rocket, speed, planetDistance) {
		const props = this.props;
		
		// invoke updateVehicle in falcone component
		props.handleRocketChange(id, rocket, speed, planetDistance);
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
		
		const ids = [uuid(), uuid(), uuid(), uuid()];
		
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
				<div className='MissionPlan__destinations'>
					<ListOfPlanets 
						planets={this.props.planets} 
						ids={ids} 
						updatePlanetNames={this.props.updatePlanetNames} 
						planet_names={this.props.planet_names} 
					/>
				</div>
			</div>
		)
	}
}

export default MissionPlan;
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
		this.props.updateListOfPlanets(id, removePlanet, planetDistance);
		this.props.updateListOfVehicles(id, planetDistance);
	}
	
	handleVehicleUpdation(id, rocket, speed, total_no) {
		this.props.updateVehicle(id, rocket, speed, total_no);
	}
	
	render() {
		const { listOfPlanets, listOfVehicles } = this.props;
		
		return (
			<div className='MissionPlan'>
				<div className='MissionPlan-destination'>
					<ChoosePlanet 
						planets={listOfPlanets[0]} 
						updatePlanet={this.updatePlanet} 
					/>
					{
						listOfVehicles[0].isRendered &&
						<AssignRocket 
							vehicles={listOfVehicles[0]}
							handleVehicleUpdation={this.handleVehicleUpdation}
						/>
					}
				</div>
				<div className='MissionPlan-destination'>
					<ChoosePlanet 
						planets={listOfPlanets[1]} 
						updatePlanet={this.updatePlanet}
					/>
					{
						listOfVehicles[1].isRendered &&
						<AssignRocket 
							vehicles={listOfVehicles[1]} 
							handleVehicleUpdation={this.handleVehicleUpdation}
						/>
					}
				</div>
				<div className='MissionPlan-destination'>
					<ChoosePlanet 
						planets={listOfPlanets[2]} 
						handleVehicleUpdation={this.handleVehicleUpdation}
					/>
					{
						listOfVehicles[2].isRendered &&
						<AssignRocket 
							vehicles={listOfVehicles[2]} 
							handleVehicleUpdation={this.handleVehicleUpdation}
						/>
					}
				</div>
				<div className='MissionPlan-destination'>
					<ChoosePlanet 
						planets={listOfPlanets[3]} 
						updatePlanet={this.updatePlanet}/>
					{
						listOfVehicles[3].isRendered &&
						<AssignRocket 
							vehicles={listOfVehicles[3]} 
							handleVehicleUpdation={this.handleVehicleUpdation}
						/>
					}
				</div>
			</div>
		)
	}
}

export default MissionPlan;
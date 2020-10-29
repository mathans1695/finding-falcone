import React, { Component } from 'react';
import ChoosePlanet from './ChoosePlanet';
import AssignRocket from './AssignRocket';
import '../styles/MissionPlan.css';

class MissionPlan extends Component {
	constructor(props) {
		super(props);
		this.state = {
			listOfPlanets: []
		}
		this.updatePlanet = this.updatePlanet.bind(this);
	}
	
	updatePlanet(id, removePlanet, planetDistance) {
		this.props.updateListOfPlanets(id, removePlanet, planetDistance);
	}
	
	render() {
		const { listOfPlanets, vehicles } = this.props;
		
		return (
			<div className='MissionPlan'>
				<div className='MissionPlan-destination'>
					<ChoosePlanet planets={listOfPlanets[0]} updatePlanet={this.updatePlanet} />
				</div>
				<div className='MissionPlan-destination'>
					<ChoosePlanet planets={listOfPlanets[1]} updatePlanet={this.updatePlanet}/>
				</div>
				<div className='MissionPlan-destination'>
					<ChoosePlanet planets={listOfPlanets[2]} updatePlanet={this.updatePlanet}/>
				</div>
				<div className='MissionPlan-destination'>
					<ChoosePlanet planets={listOfPlanets[3]} updatePlanet={this.updatePlanet}/>
				</div>
			</div>
		)
	}
}

export default MissionPlan;
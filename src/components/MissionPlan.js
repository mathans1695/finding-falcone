import React, { Component } from 'react';
import ChoosePlanet from './ChoosePlanet';
import AssignRocket from './AssignRocket';
import '../styles/MissionPlan.css';

class MissionPlan extends Component {
	constructor(props) {
		super(props);
		this.state = {
			
		}
	}
	render() {
		const { planets, vehicles } = this.props;
		
		return (
			<div className='MissionPlan'>
				<div className='MissionPlan-destination'>
					<ChoosePlanet planets={planets} />
					<AssignRocket vehicles={vehicles} />
				</div>
				<div className='MissionPlan-destination'>
					<ChoosePlanet planets={planets} />
					<AssignRocket vehicles={vehicles} />
				</div>
				<div className='MissionPlan-destination'>
					<ChoosePlanet planets={planets} />
					<AssignRocket vehicles={vehicles} />
				</div>
				<div className='MissionPlan-destination'>
					<ChoosePlanet planets={planets} />
					<AssignRocket vehicles={vehicles} />
				</div>
			</div>
		)
	}
}

export default MissionPlan;
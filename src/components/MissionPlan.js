import React, { Component } from 'react';
import ChoosePlanet from './ChoosePlanet';
import AssignRocket from './AssignRocket';

class MissionPlan extends Component {
	render() {
		const { planets, vehicles } = this.props;
		
		return (
			<div className='MissionPlan'>
				<div className='MissionPlan-destination'>
					<ChoosePlanet planets={planets} />
					<AssignRocket vehicles={vehicles} />
				</div>
			</div>
		)
	}
}

export default MissionPlan;
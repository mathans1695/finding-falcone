import React, { Component } from 'react';
import MissionPlan from './MissionPlan';

class Falcone extends Component {
	constructor(props) {
		super(props);
		this.state = {
			resultJSON: '',
			planet_names: [],
			vehicle_names: []
		}
		
		this.handleClick = this.handleClick.bind(this);
	}
	
	handleClick() {
		const { getToken } = this.props,
			  { planet_names, vehicle_names } = this.state,
			  reqBody = Object.create(null);	
		
		reqBody['planet_names'] = planet_names;
		reqBody['vehicle_names'] = vehicle_names;
		
		getToken(reqBody)
			.then(json => {
				reqBody['token'] = json.token;
				this.result(reqBody);
			})
			.catch(err => console.log(err))
	}
	
	result(reqBody) {
		this.props.getResult(reqBody)
			.then(json => this.setState({resultJSON: json}))
			.catch(err => console.log(err))
	}
	
	updatePlanetNames() {
		
	}
	
	updateVehicleNames() {
		
	}
	
	render() {
		const { planets, vehicles } = this.props;
		
		return (
			<div className='Falcone'>
				{/* Header goes here */}
				<MissionPlan planets={planets} vehicles={vehicles} />
				<button onClick={() => this.handleClick(this.state.reqBody)}>Find Falcone</button>
				{/* Footer goes here */}
			</div>
		)
	}
}

export default Falcone;
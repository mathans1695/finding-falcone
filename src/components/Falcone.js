import React, { Component } from 'react';
import { uuid } from '../helpers';
import MissionPlan from './MissionPlan';

class Falcone extends Component {
	constructor(props) {
		super(props);
		this.state = {
			resultJSON: '',
			listOfPlanets: []
		}
		
		this.handleClick = this.handleClick.bind(this);
		this.updateListOfPlanets = this.updateListOfPlanets.bind(this);
	}
	
	componentDidMount() {
		const listOfPlanets = this.state.listOfPlanets;
		const { planets, vehicles } = this.props;
		
		for(let i=0; i<4; i++) {
			listOfPlanets[i] = {};
			listOfPlanets[i]['planets'] = planets;
			listOfPlanets[i]['id'] = uuid();
			listOfPlanets[i]['previousSelected'] = [];
		}
		
		this.setState({listOfPlanets: listOfPlanets});
	}
	
	handleClick() {
		const { getToken } = this.props,
			  { planet_names, vehicle_names } = this.props,
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
	
	updateListOfPlanets(id, removePlanet, planetDistance) {
		const listOfPlanets = this.state.listOfPlanets;
		let previousSelected = [];
		
		listOfPlanets.forEach(planets => {
			if(id === planets.id) {
				if(planets.previousSelected.length > 0) {
					previousSelected.push(planets.previousSelected[0]);
					planets.previousSelected = [];
					
					const temp = {};
					temp['name'] = removePlanet;
					temp['distance'] = planetDistance;
					planets.previousSelected.push(temp);
				} else {
					const temp = {};
					temp['name'] = removePlanet;
					temp['distance'] = planetDistance;
					planets.previousSelected.push(temp);
				}
			}
		});
		
		console.log(listOfPlanets[0].planets);
		console.log(previousSelected);
		listOfPlanets.map(planets => {
			if(id !== planets.id) {
				if(previousSelected.length > 0) {
					planets.planets.push(previousSelected[0]);
				}
				const temp = [];
				for (let i=0; i<planets.planets.length; i++) {
					if(planets.planets[i].name !== removePlanet) {
						temp.push(planets.planets[i]);
					}
				}
				planets.planets = temp;
			}
			return planets;
		});
		console.log(listOfPlanets);
		
		this.setState({listOfPlanets: listOfPlanets});
	}
	
	updatePlanetNames() {
		
	}
	
	updateVehicleNames() {
		
	}
	
	render() {
		const listOfPlanets = this.state.listOfPlanets;
		const { vehicles } = this.props;
		
		return (
			<div className='Falcone'>
				{/* Header goes here */}
				{listOfPlanets.length &&
					<MissionPlan 
						listOfPlanets={listOfPlanets} 
						vehicles={vehicles} 
						updateListOfPlanets={this.updateListOfPlanets}
					/>
				}
				<button onClick={() => this.handleClick(this.state.reqBody)}>Find Falcone</button>
				{/* Footer goes here */}
			</div>
		)
	}
}

export default Falcone;
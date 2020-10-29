import React, { Component } from 'react';
import { uuid } from '../helpers';
import MissionPlan from './MissionPlan';

class Falcone extends Component {
	constructor(props) {
		super(props);
		this.state = {
			resultJSON: '',
			listOfPlanets: [],
			planet_names: [],
			vehicle_names: []
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
	
	updateListOfPlanets(id, removePlanet, planetDistance) {
		const { planet_names, listOfPlanets } = this.state;
		
		// updating other destination
		let previousSelected = [];
		
		listOfPlanets.forEach(planets => {
			if(id === planets.id) {
				if(planets.previousSelected.length > 0) {
					previousSelected.push(planets.previousSelected[0]);
					
					// Updating planet_names state
					const removeIndex = planet_names.findIndex(name => {
						return name === planets.previousSelected[0].name;
					});
					
					const selectedPlanets = Array.from(planet_names);
					selectedPlanets.splice(removeIndex, 1, removePlanet);
					
					this.setState({planet_names: selectedPlanets});
					
					
					// Updating previousSelected properyt of planets having this id
					planets.previousSelected = [];
					
					const temp = {};
					temp['name'] = removePlanet;
					temp['distance'] = planetDistance;
					planets.previousSelected.push(temp);
				} else {
					
					// Setting the previousSelected property of planets having this id
					const temp = {};
					temp['name'] = removePlanet;
					temp['distance'] = planetDistance;
					planets.previousSelected.push(temp);
					
					// updating planet_names state with removePlanet
					const selectedPlanets = Array.from(planet_names);
					selectedPlanets.push(removePlanet);
					this.setState({planet_names: selectedPlanets});
				}
			}
		});
		
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
		
		this.setState({listOfPlanets: listOfPlanets});
	}
	
	render() {
		const { listOfPlanets, planet_names, vehicle_names } = this.state;
		const { vehicles } = this.props;
		
		console.log(this.state.planet_names);
		
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
				{
					planet_names.length === 4 
					&& vehicle_names.length === 4 
					? <button onClick={() => this.handleClick(this.state.reqBody)}>Find Falcone</button>
					: <button onClick={() => this.handleClick(this.state.reqBody)} disabled={true}>Find Falcone</button>
				}
				{/* Footer goes here */}
			</div>
		)
	}
}

export default Falcone;
import React, { Component } from 'react';
import { uuid } from '../helpers';
import MissionPlan from './MissionPlan';

class Falcone extends Component {
	constructor(props) {
		super(props);
		this.state = {
			resultJSON: '',
			vehicles: Array.from(this.props.vehicles),
			listOfPlanets: [],
			listOfVehicles: [],
			planet_names: [],
			vehicle_names: []
		}
		
		this.handleClick = this.handleClick.bind(this);
		this.updateListOfPlanets = this.updateListOfPlanets.bind(this);
		this.updateListOfVehicles = this.updateListOfVehicles.bind(this);
		this.updateVehicle = this.updateVehicle.bind(this);
	}
	
	componentDidMount() {
		const listOfPlanets = [];
		const listOfVehicles = [];
		const { planets, vehicles } = this.props;
		
		for(let i=0; i<4; i++) {
			const id = uuid();
			listOfPlanets[i] = {};
			listOfPlanets[i]['planets'] = planets;
			listOfPlanets[i]['id'] = id;
			listOfPlanets[i]['previousSelected'] = [];
			
			listOfVehicles[i] = {};
			listOfVehicles[i]['vehicles'] = vehicles.map((vehicle) => {
				const temp = Object.create({}, Object.getOwnPropertyDescriptors(vehicle));
				temp['showAlways'] = false;
				return temp;
			});
			listOfVehicles[i]['id'] = id;
			listOfVehicles[i]['isRendered'] = false;
			listOfVehicles[i]['previousSelected'] = [];
		}
		
		this.setState({
			listOfPlanets: listOfPlanets,
			listOfVehicles: listOfVehicles
		});
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
		
		listOfPlanets.forEach(planets => {
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
		});
		
		this.setState({listOfPlanets: listOfPlanets});
	}
	
	updateListOfVehicles(id, planetDistance) {
		const { listOfVehicles } = this.state;
		
		listOfVehicles.forEach((vehiclesObj) => {
			if(id === vehiclesObj.id) {
				vehiclesObj['planetDistance'] = planetDistance;
				if(!vehiclesObj.isRendered) {
					vehiclesObj.isRendered = true;
				}
				
				vehiclesObj.vehicles.forEach((vehicle) => {
					if(vehicle.max_distance >= planetDistance || vehicle.total_no === 0) {
						vehicle['isPossible'] = true;
					} else {
						vehicle['isPossible'] = false;
					}
				});
			}
		});
		
		this.setState({listOfVehicles: listOfVehicles});
	}
	
	updateVehicle(id, rocket, speed, totalNumber, planetDistance) {
		const { listOfVehicles, vehicle_names } = this.state;
		
		let previousSelected = [];
		
		listOfVehicles.forEach(vehicles => {
			if(id === vehicles.id) {
				if(vehicles.previousSelected.length > 0) {
					previousSelected.push(vehicles.previousSelected[0]);
					
					// Updating planet_names state
					const removeIndex = vehicle_names.findIndex(name => {
						return name === vehicles.previousSelected[0].name;
					});
					
					const selectedVehicles = Array.from(vehicle_names);
					selectedVehicles.splice(removeIndex, 1, rocket);
					
					this.setState({vehicle_names: selectedVehicles});
					
					
					// Updating previousSelected property of vehicles having this id
					vehicles.previousSelected = [];
					
					let temp;
					vehicles.vehicles.forEach(vehicle => {
						if(vehicle.name === rocket) {
							temp = Object.create({}, Object.getOwnPropertyDescriptors(vehicle));
						}
					})
					vehicles.previousSelected.push(temp);
				} else {
					
					// Setting the previousSelected property of vehicles having this id
					let temp;
					vehicles.vehicles.forEach(vehicle => {
						if(vehicle.name === rocket) {
							temp = Object.create({}, Object.getOwnPropertyDescriptors(vehicle));
						}
					})
					vehicles.previousSelected.push(temp);
					
					// updating vehicle_names state with rocket
					const selectedVehicles = Array.from(vehicle_names);
					selectedVehicles.push(rocket);
					this.setState({vehicle_names: selectedVehicles});
				}
			}
		});
		
		listOfVehicles.forEach(vehicles => {
			if(id !== vehicles.id) {
				if(!vehicles.isRendered) {
					if(previousSelected.length > 0) {
						vehicles.vehicles.forEach(vehicle => {
							if(previousSelected[0].name === vehicle.name) {
								vehicle.total_no += 1;
							} else if(rocket === vehicle.name) {
								vehicle.total_no -= 1;
							}
						});
					} else {
						vehicles.vehicles.forEach(vehicle => {
							if(rocket === vehicle.name) {
								vehicle.total_no -= 1;
							}
						})
					}
				} 
			} else {
				if(previousSelected.length > 0) {
					vehicles.vehicles.forEach(vehicle => {
						if(previousSelected[0].name === vehicle.name) {
							vehicle.total_no += 1;
							vehicle['showAlways'] = false;
						} else if(rocket === vehicle.name) {
							vehicle.total_no -= 1;
							vehicle['showAlways'] = true;
						}
					});
				} else {
					vehicles.vehicles.forEach(vehicle => {
						if(rocket === vehicle.name) {
							vehicle.total_no -= 1;
							vehicle['showAlways'] = true;
						}
					})
				}
			}
		});
	}
	
	render() {
		const { listOfPlanets, planet_names, vehicle_names, listOfVehicles } = this.state;
		
		console.log(listOfVehicles);
		
		return (
			<div className='Falcone'>
				{/* Header goes here */}
				{listOfPlanets.length &&
				 listOfVehicles.length &&
					<MissionPlan 
						listOfPlanets={listOfPlanets} 
						listOfVehicles={listOfVehicles}
						updateListOfPlanets={this.updateListOfPlanets}
						updateListOfVehicles={this.updateListOfVehicles}
						updateVehicle={this.updateVehicle}
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
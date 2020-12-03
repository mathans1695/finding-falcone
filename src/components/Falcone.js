import React, { Component } from 'react';
import { Route, Link } from 'react-router-dom';
import _ from 'lodash';
import { getToken, getResult } from '../utils/api_requests';
import Message from './Message';
import { uuid } from '../helpers';
import '../styles/falcone.css';
import MissionPlan from './MissionPlan';
import Result from './Result';
import Navbar from './Navbar';
import Footer from './Footer';


class Falcone extends Component {
	constructor(props) {
		super(props);
		this.state = {
			resultJSON: '',
			vehicles: [],
			listOfPlanets: [],
			listOfVehicles: [],
			planet_names: new Array(4),
			vehicle_names: new Array(4),
			time: [0, 0, 0, 0],
			showMessage: ''
		}
		
		this.handleClick = this.handleClick.bind(this);
		this.updateListOfPlanets = this.updateListOfPlanets.bind(this);
		this.updateListOfVehicles = this.updateListOfVehicles.bind(this);
		this.handleRocketChange = this.handleRocketChange.bind(this);
		this.generateLists = this.generateLists.bind(this);
		this.reset = this.reset.bind(this);
	}
	
	componentDidMount() {
		this.generateLists();
	}
	
	// Creates initial list of planets and vehicles and deep copy vehicles
	// props to vehicles state
	generateLists() {
		const listOfPlanets = [];
		const listOfVehicles = [];
		const { planets, vehicles } = this.props;
		
		const vehiclesCopy = _.cloneDeep(vehicles);
		
		for(let i=0; i<4; i++) {
			const id = uuid();
			listOfPlanets[i] = {};
			listOfPlanets[i].planets = _.cloneDeep(planets);
			listOfPlanets[i].id = id;
			listOfPlanets[i].previousSelected = [];
			listOfPlanets[i].curPlanet = 'Choose Planet';
			
			listOfVehicles[i] = {};
			listOfVehicles[i].vehicles = _.cloneDeep(vehicles);
			listOfVehicles[i].vehicles.forEach(vehicle => {vehicle.showAlways = false});
			listOfVehicles[i].id = id;
			listOfVehicles[i].isRendered = false;
			listOfVehicles[i].previousSelected = '';
		}
		
		this.setState({
			listOfPlanets: listOfPlanets,
			listOfVehicles: listOfVehicles,
			vehicles: vehiclesCopy
		});
	}
	
	// method will execute on click of find falcone button
	handleClick() {
		const { planet_names, vehicle_names } = this.state,
			  reqBody = Object.create(null);	
		
		reqBody['planet_names'] = planet_names;
		reqBody['vehicle_names'] = vehicle_names;
		
		getToken()
			.then(json => {
				reqBody['token'] = json.token;
				this.result(reqBody);
			})
			.catch(err => console.log(err))
	}
	
	// method runs after token received and set resultJSON state with result
	result(reqBody) {
		getResult(reqBody)
			.then(json => this.setState({resultJSON: json}))
			.catch(err => console.log(err))
	}
	
	// update planets in other destionations on change
	updateListOfPlanets(id, removePlanet, planetDistance) {
		const { planet_names } = this.state;
		const listOfPlanets = _.cloneDeep(this.state.listOfPlanets);
		const selectedPlanets = Array.from(planet_names);
		const previousSelected = [];
		
		listOfPlanets.forEach((planets, index) => {
			if(id === planets.id) {
				planets['curPlanet'] = removePlanet;
				selectedPlanets.splice(index, 1, removePlanet);
				
				if(planets.previousSelected.length > 0) {
					previousSelected.push(planets.previousSelected[0]);
					
					// Updating previousSelected property of planets having the id
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
				}
			}
		});
		
		
		// Updating other destinations planets
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
		})
		
		this.setState({
			listOfPlanets: listOfPlanets,
			planet_names: selectedPlanets
		});
	}
	
	// method executes, when there's change in planet selection on
	// each destionations
	updateListOfVehicles(id, planetDistance) {
		const listOfVehicles = _.cloneDeep(this.state.listOfVehicles);
		const globalVehicles = _.cloneDeep(this.state.vehicles);
		const vehicle_names = _.cloneDeep(this.state.vehicle_names);
		const timeArr = _.cloneDeep(this.state.time);
		
		let notPossible, previousSelected;
		
		listOfVehicles.forEach((vehiclesObj, i) => {
			if(id === vehiclesObj.id) {
				vehiclesObj.planetDistance = planetDistance;
				if(!vehiclesObj.isRendered) {
					vehiclesObj.isRendered = true;
					vehiclesObj.vehicles.forEach((vehicle, index) => {
						if(vehicle.max_distance >= planetDistance && vehicle.total_no > 0) {
							vehicle.isPossible = true;
						} else {
							vehicle.isPossible = false;
						}
					});
				} else {
					previousSelected = vehiclesObj.previousSelected;
					vehiclesObj.vehicles.forEach((vehicle, index) => {
						if(vehicle.showAlways) {
							if(globalVehicles[index].max_distance >= planetDistance && globalVehicles[index].total_no >= 0) {
								
							} else {
								vehicle.showAlways = false;
								vehicle.isPossible = false;
								globalVehicles[index].total_no += 1;
								vehiclesObj.previousSelected = '';
								timeArr.splice(i, 1, undefined);
								notPossible = true;
							}
						} else {
							if(globalVehicles[index].max_distance >= planetDistance && globalVehicles[index].total_no > 0) {
								vehicle.isPossible = true;
							} else {
								vehicle.isPossible = false;
							}
						}
					});
				}
			}
		});
		
		listOfVehicles.forEach((vehiclesObj, i) => {
			if(notPossible && id !== vehiclesObj.id) {
				if(vehiclesObj.vehicles.every(vehicle => vehicle.showAlways === false)) {
					vehiclesObj.vehicles.forEach((vehicle, index) => {
						if(vehicle.name === previousSelected) {
							vehicle.total_no = globalVehicles[index].total_no;
						}
					});
				}
			}
			if(id === vehiclesObj.id) {
				vehiclesObj.vehicles.forEach((vehicle, index) => {
					vehicle.total_no = globalVehicles[index].total_no;
				});
			}
		});
		
		this.setState({
			listOfVehicles: listOfVehicles,
			vehicles: globalVehicles,
			vehicle_names: vehicle_names,
			time: timeArr
		});
	}
	
	updateGlobalVehicles(vehicles, rocket, previousSelected) {
		if(previousSelected) {
			vehicles.forEach(vehicle => {
				if(previousSelected === vehicle.name) {
					vehicle.total_no += 1;
				} else if(vehicle.name === rocket) {
					vehicle.total_no -= 1;
				}
			});
		} else {
			vehicles.forEach(vehicle => {
				if(vehicle.name === rocket) {
					vehicle.total_no -= 1;
				}
			});
		}
	}
	
	updateIndivVehicles(globalVehicles, indivVehicles, rocket, previousSelected, updateShowAlways=false) {
		if(previousSelected) {
			indivVehicles.forEach((vehicle, index) => {
				if(previousSelected === vehicle.name) {
					vehicle.total_no = globalVehicles[index].total_no;
					updateShowAlways && (vehicle.showAlways = false);
				} else if(vehicle.name === rocket) {
					vehicle.total_no = globalVehicles[index].total_no;
					updateShowAlways && (vehicle.showAlways = true);
				}
			});
		} else {
			indivVehicles.forEach((vehicle, index) => {
				if(vehicle.name === rocket) {
					vehicle.total_no = globalVehicles[index].total_no;
					updateShowAlways && (vehicle.showAlways = true);
				}
			});
		}
	}
	
	handleRocketChange(id, rocket, speed, planetDistance) {
		const { vehicle_names, time } = this.state;
		const listOfVehicles = _.cloneDeep(this.state.listOfVehicles);
		const globalVehicles = _.cloneDeep(this.state.vehicles);
		const selectedVehicles = _.cloneDeep(vehicle_names);
		const timeArr = Array.from(time);
		
		let previousSelected;
		let isRocketAvailable = true;
		
		globalVehicles.forEach(vehicle => {
			if(vehicle.name === rocket) {
				if(vehicle.total_no === 0) {
					isRocketAvailable = false;
				}
			}
		});
		
		if(isRocketAvailable) {
			listOfVehicles.forEach((vehicles, index) => {
				if(id === vehicles.id) {
					previousSelected = vehicles.previousSelected;
					
					this.updateGlobalVehicles(globalVehicles, rocket, previousSelected);
					selectedVehicles.splice(index, 1, rocket);
					timeArr.splice(index, 1, planetDistance/speed);
					
					this.updateIndivVehicles(globalVehicles, vehicles.vehicles, rocket, previousSelected, true);
					
					vehicles.previousSelected = rocket;
				}
			});
			
			listOfVehicles.forEach(vehicles => {
				if(id !== vehicles.id && vehicles.vehicles.every(vehicle => !vehicle['showAlways'])) {
					this.updateIndivVehicles(globalVehicles, vehicles.vehicles, rocket, previousSelected);
				}
			});
		} else {
			this.setState({showMessage: 'Selected rocket is not available'}, () => {
				setTimeout(() => {
					this.setState({showMessage: ''})
				}, 2000);
			});
		}
		
		this.setState({
			vehicles: globalVehicles,
			time: timeArr,
			vehicle_names: selectedVehicles,
			listOfVehicles: listOfVehicles
		});
	}
	
	// reset everything back to initial condition
	reset(e) {
		const target = e.target;
		const regExp = /result/i;
		const match = regExp.test(window.location.href);
		
		if(match) {
			if(target.innerText === 'Reset' || target.innerText === '') {
				this.props.history.push('/');
			}
		} 
		
		this.generateLists();
		this.setState({
			planet_names: [],
			vehicle_names: [],
			time: [],
			resultJSON: ''
		})
		
		if(target.innerText === 'Reset' || target.innerText === '') {
			this.setState({showMessage: 'Reset successful'}, () => {
				setTimeout(() => {
					this.setState({showMessage: ''})
				}, 2000);
			});
		}
	}
	
	render() {
		const { listOfPlanets, 
				planet_names, 
				vehicle_names, 
				listOfVehicles, 
				time,
				resultJSON,
				showMessage
			  } = this.state;
			  
		let enableFindFalcone = false;
		for(let i=0; i<planet_names.length; i++) {
			if(planet_names[i] && vehicle_names[i]) {
				enableFindFalcone = true;
			}
		}
		
		
		return (
			<div className='Falcone'>
				<Navbar reset={this.reset}/>
				<Route exact path='/'>
					<main className='Falcone__main'>
						{listOfPlanets.length &&
						 listOfVehicles.length &&
							<MissionPlan 
								listOfPlanets={listOfPlanets} 
								listOfVehicles={listOfVehicles}
								updateListOfPlanets={this.updateListOfPlanets}
								updateListOfVehicles={this.updateListOfVehicles}
								handleRocketChange={this.handleRocketChange}
								time={time}
							/>
						}
						{
							enableFindFalcone
							? <Link to='/result'>
								<button 
									onClick={this.handleClick} 
									className='Falcone__button'
								>
									Find Falcone
								</button>
							  </Link>
							: <button 
								disabled={true} 
								className='Falcone__button'
							>
								Find Falcone
							</button>
						}
					</main>
				</Route>
				<Route 
					exact 
					path='/result' 
					render={() => {
						return (
							<main className='Falcone__main'>
								<Result resultJSON={resultJSON} time={time} reset={this.reset} />
							</main>
						)
					}}
				/>
				<Footer />
				{
					showMessage &&
					<Message msg={showMessage} />
				}
			</div>
		)
	}
}

export default Falcone;
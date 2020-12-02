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
			planet_names: Array.from(4),
			vehicle_names: Array.from(4),
			time: Array.from(4),
			showMessage: ''
		}
		
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
			listOfPlanets[i]['planets'] = _.cloneDeep(planets);
			listOfPlanets[i]['id'] = id;
			listOfPlanets[i]['previousSelected'] = [];
			listOfPlanets[i]['curPlanet'] = 'Choose Planet';
			
			listOfVehicles[i] = {};
			listOfVehicles[i]['vehicles'] = _.cloneDeep(vehicles);
			listOfVehicles[i]['vehicles'].forEach(vehicle => {vehicle.showAlways = false});
			listOfVehicles[i]['id'] = id;
			listOfVehicles[i]['isRendered'] = false;
			listOfVehicles[i]['previousSelected'] = '';
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
		let listOfPlanets = _.cloneDeep(this.state.listOfPlanets);
		const selectedPlanets = Array.from(planet_names);
		let previousSelected = [];
		
		listOfPlanets.forEach(planets => {
			if(id === planets.id) {
				planets['curPlanet'] = removePlanet;
				if(planets.previousSelected.length > 0) {
					previousSelected.push(planets.previousSelected[0]);
					
					// Updating planet_names state copy
					const removeIndex = selectedPlanets.findIndex(name => {
						return name === planets.previousSelected[0].name;
					});
					
					selectedPlanets.splice(removeIndex, 1, removePlanet);
					
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
					
					// updating planet_names state with removePlanet
					selectedPlanets.push(removePlanet);
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
				vehiclesObj['planetDistance'] = planetDistance;
				if(!vehiclesObj.isRendered) {
					vehiclesObj.isRendered = true;
					vehiclesObj.vehicles.forEach((vehicle, index) => {
						if(vehicle.max_distance >= planetDistance && vehicle.total_no > 0) {
							vehicle['isPossible'] = true;
						} else {
							vehicle['isPossible'] = false;
						}
					});
				} else {
					previousSelected = vehiclesObj.previousSelected;
					vehiclesObj.vehicles.forEach((vehicle, index) => {
						if(vehicle.showAlways) {
							if(vehicle.max_distance >= planetDistance && vehicle.total_no >= 0) {
								
							} else {
								vehicle.showAlways = false;
								vehicle.isPossible = false;
								vehicle.total_no += 1;
								globalVehicles[index].total_no += 1;
								vehiclesObj.previousSelected = '';
								timeArr.splice(i);
								notPossible = true;
							}
						} else {
							if(vehicle.max_distance >= planetDistance && vehicle.total_no > 0) {
								vehicle['isPossible'] = true;
							} else {
								vehicle['isPossible'] = false;
							}
						}
					});
				}
			}
		});
		
		listOfVehicles.forEach((vehiclesObj, i) => {
			if(notPossible && id !== vehiclesObj.id) {
				vehiclesObj.vehicles.forEach(vehicle => {
					if(vehicle.name === previousSelected) {
						vehicle.total_no += 1;
					}
				});
			}
			if(notPossible && id === vehiclesObj.id) {
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
	
	updateVehicles(vehicles, rocket, previousSelected, updateShowAlways = false) {
		if(previousSelected) {
			vehicles.forEach(vehicle => {
				if(previousSelected === vehicle.name) {
					vehicle.total_no += 1;
					updateShowAlways && (vehicle.showAlways = false);
				} else if(vehicle.name === rocket) {
					vehicle.total_no -= 1;
					updateShowAlways && (vehicle.showAlways = true);
				}
			});
		} else {
			vehicles.forEach(vehicle => {
				if(vehicle.name === rocket) {
					vehicle.total_no -= 1;
					updateShowAlways && (vehicle.showAlways = true);
				}
			});
		}
	}
	
	updateVehicleNames(selectedVehicles, rocket, previousSelected) {
		if(previousSelected) {
			const removeIndex = selectedVehicles.findIndex(name => {
				return name === previousSelected;
			});
			
			selectedVehicles.splice(removeIndex, 1, rocket);
		} else {
			selectedVehicles.push(rocket);
		}
	}
	
	updateTime(timeArr, selectedVehicles, planetDistance, speed, previousSelected) {
		if(previousSelected) {
			const removeIndex = selectedVehicles.findIndex(name => {
				return name === previousSelected;
			});
			
			timeArr.splice(removeIndex, 1, planetDistance/speed);
		} else {
			timeArr.push(planetDistance/speed);
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
			listOfVehicles.forEach(vehicles => {
				if(id === vehicles.id) {
					previousSelected = vehicles.previousSelected;
					
					this.updateVehicles(globalVehicles, rocket, previousSelected);
					this.updateVehicleNames(selectedVehicles, rocket, previousSelected);
					this.updateTime(timeArr, selectedVehicles, planetDistance, speed, previousSelected);
					this.updateVehicles(vehicles.vehicles, rocket, previousSelected, true);
					
					vehicles.previousSelected = rocket;
				}
			});
			
			listOfVehicles.forEach(vehicles => {
				if(id !== vehicles.id) {
					if(!vehicles.isRendered) {
						this.updateVehicles(vehicles.vehicles, rocket, previousSelected);
					} else {
						if(vehicles.vehicles.every(vehicle => !vehicle['showAlways'])) {
							this.updateVehicles(vehicles.vehicles, rocket, previousSelected);
						}
					}
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
							planet_names.length === 4 
							&& vehicle_names.length === 4 
							? <Link to='/result'>
								<button 
									onClick={() => this.handleClick()} 
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
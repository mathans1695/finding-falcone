import React, { Component } from 'react';
import { Route, Link, Redirect } from 'react-router-dom';
import _ from 'lodash';
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
			planet_names: [],
			vehicle_names: [],
			time: [],
			showMessage: ''
		}
		
		this.handleClick = this.handleClick.bind(this);
		this.updateListOfPlanets = this.updateListOfPlanets.bind(this);
		this.updateListOfVehicles = this.updateListOfVehicles.bind(this);
		this.updateVehicle = this.updateVehicle.bind(this);
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
		vehiclesCopy.forEach(vehicle => {
			vehicle['selected'] = 0;
		})
		
		for(let i=0; i<4; i++) {
			const id = uuid();
			listOfPlanets[i] = {};
			listOfPlanets[i]['planets'] = _.cloneDeep(planets);
			listOfPlanets[i]['id'] = id;
			listOfPlanets[i]['previousSelected'] = [];
			listOfPlanets[i]['curPlanet'] = 'Choose Planet';
			
			listOfVehicles[i] = {};
			listOfVehicles[i]['vehicles'] = _.cloneDeep(vehicles);
			listOfVehicles[i]['vehicles']['showAlways'] = false;
			listOfVehicles[i]['id'] = id;
			listOfVehicles[i]['isRendered'] = false;
			listOfVehicles[i]['previousSelected'] = [];
		}
		
		this.setState({
			listOfPlanets: listOfPlanets,
			listOfVehicles: listOfVehicles,
			vehicles: vehiclesCopy
		});
	}
	
	// method will execute on click of find falcone button
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
	
	// method runs after token received and set resultJSON state with result
	result(reqBody) {
		this.props.getResult(reqBody)
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
					const removeIndex = planet_names.findIndex(name => {
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
		
		listOfVehicles.forEach((vehiclesObj) => {
			if(id === vehiclesObj.id) {
				vehiclesObj['planetDistance'] = planetDistance;
				if(!vehiclesObj.isRendered) {
					vehiclesObj.isRendered = true;
				}
				
				vehiclesObj.vehicles.forEach((vehicle) => {
					if(vehicle.max_distance >= planetDistance || vehicle.total_no > 0) {
						vehicle['isPossible'] = true;
					} else {
						vehicle['isPossible'] = false;
					}
				});
			}
		});
		
		this.setState({listOfVehicles: listOfVehicles});
	}
	
	// Updates vehicles on other destinations on selecting the rocket in 
	// each destinations
	updateVehicle(id, rocket, speed, planetDistance) {
		const { vehicle_names, time } = this.state;
		const listOfVehicles = _.cloneDeep(this.state.listOfVehicles);
		const previousSelected = [];
		const vehi = _.cloneDeep(this.state.vehicles);
		const selectedVehicles = _.cloneDeep(vehicle_names);
		const timeArr = Array.from(time);
		let check = true;
		
		// vehi will keep track of all changes
		// vehi act as reference for changes in vehicles in each destinations
		
		// checks current stock
		vehi.forEach(vehicle => {
			if(vehicle.name === rocket) {
				if(vehicle.total_no === 0) {
					check = false;
				}
			}
		})
		
		// if rocket in stock, perform the below operations
		// otherwise convey the message
		if(check) {
			listOfVehicles.forEach(vehicles => {
				if(id === vehicles.id) {
					if(vehicles.previousSelected.length > 0) {
						previousSelected.push(vehicles.previousSelected[0]);
					
						// Updating vehicle_names state copy
						const removeIndex = vehicle_names.findIndex(name => {
							return name === vehicles.previousSelected[0].name;
						});
						selectedVehicles.splice(removeIndex, 1, rocket);
						
						// updating the vehi
						vehi.forEach(vehicle => {
							if(vehicles.previousSelected[0].name === vehicle.name) {
								vehicle.total_no += 1;
								vehicle.selected -= 1;
							} else if(vehicle.name === rocket) {
								vehicle.total_no -= 1;
								vehicle.selected += 1;
							}
						})
					
						// updating the timeArr with new time
						timeArr.splice(removeIndex, 1, planetDistance/speed);
					
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
						selectedVehicles.push(rocket);
						
						// updating vehi
						vehi.forEach(vehicle => {
							if(vehicle.name === rocket) {
								if(vehicle.selected) {
									if(vehicle.total_no > 0) {
										vehicle.total_no -= 1;
										vehicle.selected += 1;
									}
								} else {
									vehicle.selected += 1;
									vehicle.total_no -= 1;
								}
							}
						})
					
						// updating time array
						timeArr.push(planetDistance/speed);
					}
				}		
			});
			
			listOfVehicles.forEach(vehicles => {
				
				// updating vehicles in other destinations that don't have
				// the id. Separate strategy for vehicle that are rendered // and not rendered
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
					} else {
						if(vehicles.vehicles.every(vehicle => !vehicle['showAlways'])) {
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
					}
				} 
				// updating vehicles with the id
				else {
					if(previousSelected.length > 0) {
						vehicles.vehicles.forEach((vehicle, index) => {
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
		} else {
			this.setState({showMessage: 'Selected rocket is not available'}, () => {
				setTimeout(() => {
					this.setState({showMessage: ''})
				}, 2000);
			});
		}
		
		this.setState({
			vehicles: vehi,
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
		
		if(match && target.innerText === 'Reset') {
			window.location.replace('http://localhost:3000/');
		}
		
		this.generateLists();
		this.setState({
			planet_names: [],
			vehicle_names: [],
			time: [],
			resultJSON: ''
		})
		
		if(target.innerText === 'Reset') {
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
								updateVehicle={this.updateVehicle}
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
					render={() => <Result resultJSON={resultJSON} time={time} reset={this.reset} />}
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
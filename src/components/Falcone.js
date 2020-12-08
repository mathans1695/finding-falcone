import React, { useEffect, useState } from 'react';
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


function Falcone(props) {
	const [resultJSON, setResultJSON] = useState('');
	const [vehicles, setVehicles] = useState([]);
	const [listOfPlanets, setListOfPlanets] = useState([]);
	const [listOfVehicles, setListOfVehicles] = useState([]);
	const [selectedPlanets, setSelectedPlanets] = useState(new Array(4));
	const [selectedVehicles, setSelectedVehicles] = useState(new Array(4));
	const [time, setTime] = useState([0, 0, 0, 0]);
	const [message, setMessage] = useState('');
	
	useEffect(() => {
		generateLists();
	}, []);
	
	useEffect(() => {
		setTimeout(() => {
			setMessage('');
		}, 2000)
	}, [message]);
	
	// Creates initial list of planets and vehicles and deep copy vehicles
	// props to vehicles state
	function generateLists() {
		const tempListOfPlanets = [];
		const tempListOfVehicles = [];
		const { planets, vehicles } = props;
		
		const vehiclesCopy = _.cloneDeep(vehicles);
		
		for(let i=0; i<4; i++) {
			const id = uuid();
			tempListOfPlanets[i] = {};
			tempListOfPlanets[i].planets = _.cloneDeep(planets);
			tempListOfPlanets[i].id = id;
			tempListOfPlanets[i].previousSelected = [];
			tempListOfPlanets[i].curPlanet = 'Choose Planet';
			
			tempListOfVehicles[i] = {};
			tempListOfVehicles[i].vehicles = _.cloneDeep(vehicles);
			tempListOfVehicles[i].vehicles.forEach(vehicle => {vehicle.showAlways = false});
			tempListOfVehicles[i].id = id;
			tempListOfVehicles[i].isRendered = false;
			tempListOfVehicles[i].previousSelected = '';
		}
		
		setListOfPlanets(tempListOfPlanets);
		setListOfVehicles(tempListOfVehicles);
		setVehicles(vehiclesCopy);
	}
	
	// method will execute on click of find falcone button
	function handleClick() {
		const reqBody = Object.create(null);	
		
		reqBody.planet_Names = selectedPlanets;
		reqBody.vehicle_Names = selectedVehicles;
		
		getToken()
			.then(json => {
				reqBody.token = json.token;
				result(reqBody);
			})
			.catch(err => console.log(err))
	}
	
	// method runs after token received and set resultJSON state with result
	function result(reqBody) {
		getResult(reqBody)
			.then(json => setResultJSON(json))
			.catch(err => console.log(err))
	}
	
	// update planets in other destionations on change
	function updateListOfPlanets(id, removePlanet, planetDistance) {
		const listOfPlanetsCopy = _.cloneDeep(listOfPlanets);
		const previousSelected = [];
		
		listOfPlanetsCopy.forEach((planets, index) => {
			if(id === planets.id) {
				planets.curPlanet = removePlanet;
				
				updateselectedPlanets(index, removePlanet);
				
				if(planets.previousSelected.length > 0) {
					previousSelected.push(planets.previousSelected[0]);
					
					// Updating previousSelected property of planets having the id
					planets.previousSelected = [];
					
					const temp = {};
					temp.name = removePlanet;
					temp.distance = planetDistance;
					planets.previousSelected.push(temp);
				} else {
					
					// Setting the previousSelected property of planets having this id
					const temp = {};
					temp.name = removePlanet;
					temp.distance = planetDistance;
					planets.previousSelected.push(temp);
				}
			}
		});
		
		
		// Updating other destinations planets
		listOfPlanetsCopy.forEach(planets => {
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
		
		setListOfPlanets(listOfPlanetsCopy);
	}
	
	// method executes, when there's change in planet selection on
	// each destionations
	function updateListOfVehicles(id, planetDistance) {
		const listOfVehiclesCopy = _.cloneDeep(listOfVehicles);
		const globalVehicles = _.cloneDeep(vehicles);
		
		let notPossible, previousSelected;
		
		listOfVehiclesCopy.forEach((vehicles, i) => {
			if(id === vehicles.id) {
				vehicles.planetDistance = planetDistance;
				if(!vehicles.isRendered) {
					vehicles.isRendered = true;
					vehicles.vehicles.forEach((vehicle, index) => {
						if(vehicle.max_distance >= planetDistance && vehicle.total_no > 0) {
							vehicle.isPossible = true;
						} else {
							vehicle.isPossible = false;
						}
					});
				} else {
					previousSelected = vehicles.previousSelected;
					vehicles.vehicles.forEach((vehicle, index) => {
						if(vehicle.showAlways) {
							if(globalVehicles[index].max_distance >= planetDistance && globalVehicles[index].total_no >= 0) {
							} else {
								vehicle.showAlways = false;
								vehicle.isPossible = false;
								globalVehicles[index].total_no += 1;
								vehicles.previousSelected = '';
								
								updateselectedVehicles(i, undefined);
								updateTime(i, 0);
								
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
		
		listOfVehiclesCopy.forEach((vehicles, i) => {
			if(notPossible && id !== vehicles.id) {
				if(vehicles.vehicles.every(vehicle => vehicle.showAlways === false)) {
					vehicles.vehicles.forEach((vehicle, index) => {
						if(vehicle.name === previousSelected) {
							vehicle.total_no = globalVehicles[index].total_no;
						}
					});
				}
			}
			if(id === vehicles.id) {
				vehicles.vehicles.forEach((vehicle, index) => {
					vehicle.total_no = globalVehicles[index].total_no;
				});
			}
		});
		
		setListOfVehicles(listOfVehiclesCopy);
		setVehicles(globalVehicles);
	}
	
	function changeGlobalVehicles(vehicles, rocket, previousSelected) {
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
	
	function changeIndivVehicles(globalVehicles, indivVehicles, rocket, previousSelected, updateShowAlways=false) {
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
	
	function updateselectedPlanets(index, value) {
		const selectedPlanetsCopy = Array.from(selectedPlanets);
		selectedPlanetsCopy.splice(index, 1, value);
		
		setSelectedPlanets(selectedPlanetsCopy);
	}
	
	function updateselectedVehicles(index, value) {
		const selectedVehiclesCopy = Array.from(selectedVehicles);
		selectedVehiclesCopy.splice(index, 1, value);
		
		setSelectedVehicles(selectedVehiclesCopy);
	}
	
	function updateTime(index, value) {
		const timeCopy = Array.from(time);
		timeCopy.splice(index, 1, value);
		
		setTime(timeCopy);
	}
	
	function handleRocketChange(id, rocket, speed, planetDistance) {
		const listOfVehiclesCopy = _.cloneDeep(listOfVehicles);
		const globalVehicles = _.cloneDeep(vehicles);
		
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
			listOfVehiclesCopy.forEach((vehicles, index) => {
				if(id === vehicles.id) {
					previousSelected = vehicles.previousSelected;
					
					changeGlobalVehicles(globalVehicles, rocket, previousSelected);
					updateselectedVehicles(index, rocket);
					updateTime(index, planetDistance/speed);
					changeIndivVehicles(globalVehicles, vehicles.vehicles, rocket, previousSelected, true);
					
					vehicles.previousSelected = rocket;
				}
			});
			
			listOfVehiclesCopy.forEach(vehicles => {
				if(id !== vehicles.id && vehicles.vehicles.every(vehicle => !vehicle.showAlways)) {
					changeIndivVehicles(globalVehicles, vehicles.vehicles, rocket, previousSelected);
				}
			});
		} else {
			setMessage('Selected rocket is not available');
		}
		
		setListOfVehicles(listOfVehiclesCopy);
		setVehicles(globalVehicles);
	}
	
	// reset everything back to initial condition
	function reset(e) {
		const target = e.target;
		const regExp = /result/i;
		const match = regExp.test(window.location.href);
		
		if(match) {
			if(target.innerText === 'Reset' || target.innerText === '') {
				props.history.push('/');
			}
		} 
		
		generateLists();
		setSelectedPlanets([]);
		setSelectedVehicles([]);
		setTime([]);
		setResultJSON('');
		
		if(target.innerText === 'Reset' || target.innerText === '') {
			setMessage('Reset successful')
		}
	}
	
	let count = 0;
	let enableFindFalcone = false;
			  
	for (let i=0; i<selectedVehicles.length; i++) {
		if(selectedVehicles[i]) {
			count += 1;
		}
	}
		
	if(count === 4) {
		enableFindFalcone = true;
	}
		
	return (
		<div className='Falcone'>
			<Navbar reset={reset}/>
			<Route exact path='/'>
				<main className='Falcone__main'>
					{listOfPlanets.length &&
					 listOfVehicles.length &&
						<MissionPlan 
							listOfPlanets={listOfPlanets} 
							listOfVehicles={listOfVehicles}
							updateListOfPlanets={updateListOfPlanets}
							updateListOfVehicles={updateListOfVehicles}
							handleRocketChange={handleRocketChange}
							time={time}
						/>
					}
					{
						enableFindFalcone
						? <Link to='/result'>
							<button 
								onClick={handleClick} 
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
							<Result resultJSON={resultJSON} time={time} reset={reset} />
						</main>
					)
				}}
			/>
			<Footer />
			{
				message &&
				<Message msg={message} />
			}
		</div>
	)
}

export default Falcone;
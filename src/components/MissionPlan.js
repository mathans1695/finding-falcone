import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import { uuid } from '../helpers';
import ChoosePlanet from './ChoosePlanet';
import AssignRocket from './AssignRocket';
import '../styles/MissionPlan.css';

function MissionPlan(props) {
	const [vehicles, setVehicles] = useState([]);
	const [listOfPlanets, setListOfPlanets] = useState([]);
	const [listOfVehicles, setListOfVehicles] = useState([]);
	
	useEffect(() => {
		generateLists();
	}, []);
	
	function generateLists() {
		const { planets, vehicles } = props;
		const tempListOfPlanets = [];
		const tempListOfVehicles = [];
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
	
	function updateListOfPlanets(id, removePlanet, planetDistance) {
		const listOfPlanetsCopy = _.cloneDeep(listOfPlanets);
		const previousSelected = [];
		
		listOfPlanetsCopy.forEach((planets, index) => {
			if(id === planets.id) {
				planets.curPlanet = removePlanet;
				
				props.updateSelectedPlanets(index, removePlanet);
				
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
								
								props.updateSelectedVehicles(i, undefined);
								props.updateTime(i, 0);
								
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
					props.updateSelectedVehicles(index, rocket);
					props.updateTime(index, planetDistance/speed);
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
			props.updateMessage('Selected rocket is not available');
		}
		
		setListOfVehicles(listOfVehiclesCopy);
		setVehicles(globalVehicles);
	}
	
	const chooseDestinations = (
		listOfVehicles.map((vehiclesObj, index) => {
			return (
				<div className='MissionPlan__destination' key={index}>
					<h3 className='MissionPlan__title'>Destination-{index+1}</h3>
					<ChoosePlanet 
						planets={listOfPlanets[index]} 
						updateListOfPlanets={updateListOfPlanets}
						updateListOfVehicles={updateListOfVehicles}
					/>
					{
						listOfVehicles[index].isRendered &&
						<AssignRocket 
							vehicles={listOfVehicles[index]}
							handleVehicleUpdation={handleRocketChange}
						/>
					}
				</div>
			)
		})
	)
	
	return (
		<div className='MissionPlan'>
			<p className='MissionPlan__instructions'>Select planets you want to search in:</p>
			<div className='MissionPlan__destinations'>
				{chooseDestinations}
			</div>
			{
				props.time.length 
				? <div className='MissionPlan__time'>
						Total Time: {
							props.time.reduce((accumulator, curValue) => accumulator + curValue, 0)
					}
				  </div>
				: <div className='MissionPlan__time'>
							Total Time: 0
				  </div>
			}
		</div>
	)
}

export default MissionPlan;
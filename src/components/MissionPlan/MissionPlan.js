import React, { Component } from 'react';
import _ from 'lodash';
import { uuid } from '../../utils/helpers';
import ChoosePlanet from '../ChoosePlanet/ChoosePlanet';
import AssignRocket from '../AssignRocket/AssignRocket';
import './MissionPlan.css';

class MissionPlan extends Component {
	constructor(props) {
		super(props);
		this.state = {
			vehicles: [],
			listOfPlanets: [],
			listOfVehicles: []
		}
	}
	
	componentDidMount() {
		this.generateLists();
	}
	
	generateLists = () => {
		const { planets, vehicles } = this.props;
		const tempListOfPlanets = [];
		const tempListOfVehicles = [];
		const vehiclesCopy = _.cloneDeep(this.props.vehicles);
		
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
		
		this.setState({
			listOfPlanets: tempListOfPlanets,
			listOfVehicles: tempListOfVehicles,
			vehicles: vehiclesCopy
		});
	}
	
	updateListOfPlanets = (id, removePlanet, planetDistance) => {
		const listOfPlanetsCopy = _.cloneDeep(this.state.listOfPlanets);
		const previousSelected = [];
		
		listOfPlanetsCopy.forEach((planets, index) => {
			if(id === planets.id) {
				planets.curPlanet = removePlanet;
				
				this.props.updateSelectedPlanets(index, removePlanet);
				
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
		
		this.setState({
			listOfPlanets: listOfPlanetsCopy
		});
	}
	
	// method executes, when there's change in planet selection on
	// each destionations
	updateListOfVehicles = (id, planetDistance) => {
		const listOfVehiclesCopy = _.cloneDeep(this.state.listOfVehicles);
		const globalVehicles = _.cloneDeep(this.state.vehicles);
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
								
								this.props.updateSelectedVehicles(i, undefined);
								this.props.updateTime(i, 0);
								
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
		
		this.setState({
			vehicles: globalVehicles,
			listOfVehicles: listOfVehiclesCopy
		});
	}
	
	changeGlobalVehicles = (vehicles, rocket, previousSelected) => {
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
	
	changeIndivVehicles = (globalVehicles, indivVehicles, rocket, previousSelected, updateShowAlways=false) => {
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
	
	handleRocketChange = (id, rocket, speed, planetDistance) => {
		const listOfVehiclesCopy = _.cloneDeep(this.state.listOfVehicles);
		const globalVehicles = _.cloneDeep(this.state.vehicles);
		
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
					
					this.changeGlobalVehicles(globalVehicles, rocket, previousSelected);
					this.props.updateSelectedVehicles(index, rocket);
					this.props.updateTime(index, planetDistance/speed);
					this.changeIndivVehicles(globalVehicles, vehicles.vehicles, rocket, previousSelected, true);
					
					vehicles.previousSelected = rocket;
				}
			});
			
			listOfVehiclesCopy.forEach(vehicles => {
				if(id !== vehicles.id && vehicles.vehicles.every(vehicle => !vehicle.showAlways)) {
					this.changeIndivVehicles(globalVehicles, vehicles.vehicles, rocket, previousSelected);
				}
			});
		} else {
			this.props.updateMessage('Selected rocket is not available');
		}
		
		this.setState({
			vehicles: globalVehicles,
			listOfVehicles: listOfVehiclesCopy
		});
	}
	
	render() {
		const { listOfPlanets, listOfVehicles } = this.state;
		const chooseDestinations = (
			listOfVehicles.map((vehicles, index) => {
				return (
					<div className='MissionPlan__destination' key={index}>
						<h3 className='MissionPlan__title'>Destination-{index+1}</h3>
						<ChoosePlanet 
							planets={listOfPlanets[index]} 
							updateListOfPlanets={this.updateListOfPlanets}
							updateListOfVehicles={this.updateListOfVehicles}
						/>
						{
							listOfVehicles[index].isRendered &&
							<AssignRocket 
								vehicles={listOfVehicles[index]}
								handleVehicleUpdation={this.handleRocketChange}
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
					this.props.time.length 
					? <div className='MissionPlan__time'>
							Total Time: {
								this.props.time.reduce((accumulator, curValue) => accumulator + curValue, 0)
						}
					</div>
					: <div className='MissionPlan__time'>
							Total Time: 0
					</div>
				}
			</div>
		)
	}
}

export default MissionPlan;
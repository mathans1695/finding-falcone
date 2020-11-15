import React from 'react';
import { mount } from 'enzyme';
import { BrowserRouter as Router } from 'react-router-dom';
import Falcone from './Falcone';
import { getPlanets, getVehicles } from './../helpers';

const planets = getPlanets();
const vehicles = getVehicles();

function getStocks(initialObj, finalObj, vehicleName) {
	let initialStock, finalStock;
	
	initialObj.vehicles.forEach((vehicle, index) => {
		if(vehicle.name === vehicleName) {
			initialStock = vehicle.total_no;
			finalStock = finalObj.vehicles[index].total_no;
		}
	});
	
	return {
		initialStock: initialStock,
		finalStock: finalStock
	}
}

// Creates synthetic event
function planetChangeEvent(optionElements, value, id) {
	const options = optionElements.map((optionElement, i) => {
		const temp = {};
		if(value === optionElement.props().value) {
			temp['selected'] = true;
		} else {
			temp['selected'] = false;
		}
		
		if(i !== 0) {
			temp['getAttribute'] = function(attr) {
				return optionElement.prop('data-distance');
			}
		} else {
			temp['getAttribute'] = function(attr) {
				return 0;
			}
		}
		return temp;
	})
	
	return {
		target: {
			parentElement: {
				id: id
			},
			value: value,
			options: options
		}
	}
}

function selectPlanet(falcone, planetName, destination, changeOrSelect, soFarRendered) {
	let description;
	if(changeOrSelect === 'change'){
		description = `User change destination ${destination} to ${planetName}`;
	} else {
		description = `User select ${planetName} planet in destination ${destination}`;
	}
			
	describe(`${description}`, () => {
		let state;
		beforeAll(() => {
			const choosePlanets = falcone.find('.ChoosePlanet'),
				  choosePlanet = choosePlanets.at(destination-1),
				  selectElement = choosePlanet.find('.ChoosePlanet__Select'),
				  optionElements = selectElement.find('.ChoosePlanet__Option'),
				  event = planetChangeEvent(optionElements, planetName, choosePlanet.props().id);
				  
			selectElement.simulate('change', event);
			state = falcone.find(Falcone).instance().state;
		});
		
		it(`planet_names state should have ${planetName} in it`, () => {
			const planetNames = state.planet_names;
			expect(planetNames.find(planet => planet === planetName)).toBe(planetName);
		});
		
		it('Assign Rockets should render after planet selection', () => {
			const assignRocket = falcone.find('.AssignRocket');
			expect(assignRocket.length).toBe(soFarRendered);
		});
			
		it(`Other destinations should not have ${planetName} option`, () => {
			const updatedPlanets = falcone.find('.ChoosePlanet');
			let checks = true;
			updatedPlanets.forEach((choosePlanet, index) => {
				if(index !== destination-1) {
					const optionElements = choosePlanet.find('.ChoosePlanet__Option');
					optionElements.forEach((optionElem) => {
						if(optionElem.prop('value') === planetName) {
							checks = false;
						}
					});
				}
			});
			expect(checks).toBeTruthy();
		});
	});
}

function vehicleChangeEvent(value, speed, id) {
	return {
		target: {
			value: value,
			getAttribute: function(attr) {
				if(attr === 'data-speed') return speed;
				if(attr === 'data-id') return id;
			}
		},
	}
}

function selectRocket(falcone, planetName, destination, vehicleName) {
	describe(`User select ${planetName} planet and ${vehicleName} rocket in destination-${destination}`, () => {
		let initialState, finalState;
		
		beforeAll(() => {
			const choosePlanets = falcone.find('.ChoosePlanet'),
				  choosePlanet = choosePlanets.at(destination-1),
				  selectElement = choosePlanet.find('.ChoosePlanet__Select'),
				  optionElements = selectElement.find('.ChoosePlanet__Option'),
				  planetEvent = planetChangeEvent(optionElements, planetName, choosePlanet.props().id);
				  
			initialState = falcone.find(Falcone).instance().state;
			selectElement.simulate('change', planetEvent);
			
			const assignRockets = falcone.find('.AssignRocket'),
				  assignRocket = assignRockets.at(destination-1),
				  inputElements = assignRocket.find('.AssignRocket__option');
			
			inputElements.forEach((inputDiv, i) => {
				const value = inputDiv.props().children[0].props.value;
				if(value === vehicleName) {
					const input = inputDiv.find('input'),
						  speed = input.props()['data-speed'],
						  id = input.props()['data-id'];
						  
					const vehicleEvent = vehicleChangeEvent(vehicleName, speed, id);
					
					input.simulate('change', vehicleEvent);
				}
			});
			
			finalState = falcone.find(Falcone).instance().state;
		});
		
		it(`Vehicle_names state should have ${vehicleName} rocket`, () => {
			expect(finalState.vehicle_names.find(vehicle => vehicle === vehicleName)).toBe(vehicleName);
		});
		
		it('Time state should have the estimated time', () => {
			expect(finalState.time.length).toBe(initialState.time.length+1);
		});
		
		it('vehicles state should get updated', () => {
			const { initialStock, finalStock } = getStocks(initialState, finalState, vehicleName);
			expect(finalStock).toBe(initialStock-1);
		});
		
		it(`Current destination ${vehicleName} stock should reduce by 1`, () => {
			const initialObj = initialState.listOfVehicles[destination-1],
				  finalObj = finalState.listOfVehicles[destination-1],
				  { initialStock, finalStock } = getStocks(initialObj, finalObj, vehicleName);
				  
			expect(finalStock).toBe(initialStock-1);
		});
		
		it(`Other destinations ${vehicleName} stock should reduce by 1, if AssignRocket component has not been rendered yet or user has not selected any vehicle in other destination`, () => {
			const state = falcone.find(Falcone).instance().state;
			let checks = true;
			state.listOfVehicles.forEach((vehicleObj, index) => {
				if(index !== destination-1) {
					if(vehicleObj.previousSelected.length === 0) {
						vehicleObj.vehicles.forEach((vehicle, vIndex) => {
							if(vehicle.name === vehicleName) {
								const initialStock = initialState.listOfVehicles[index].vehicles[vIndex].total_no;
								
								const finalStock = vehicle.total_no;
								
								if(finalStock !== initialStock-1) {
									checks = false;
								}
							}
						});
					}
				}
			});
			expect(checks).toBeTruthy();
		});
	});
}

function changeRocket(planetNames, vehicleNames, destinations, changeRocketObj) {
	describe(`User change ${changeRocketObj.changeFrom} to ${changeRocketObj.changeTo} in destination-${changeRocketObj.destination}`, () => {
		let initialState, finalState, falcone;
		
		beforeAll(() => {
			falcone = mount(
				<Router>
					<Falcone planets={planets} vehicles={vehicles} />
				</Router>
			);
			
			destinations.forEach((destination, index) => {
				const choosePlanets = falcone.find('.ChoosePlanet'),
					  choosePlanet = choosePlanets.at(destination-1),
					  selectElement = choosePlanet.find('.ChoosePlanet__Select'),
					  optionElements = selectElement.find('.ChoosePlanet__Option'),
					  planetEvent = planetChangeEvent(optionElements, planetNames[index], choosePlanet.props().id);
					  
				selectElement.simulate('change', planetEvent);
				
				const assignRockets = falcone.find('.AssignRocket'),
					  assignRocket = assignRockets.at(destination-1),
					  inputElements = assignRocket.find('.AssignRocket__option');
			
				inputElements.forEach((inputDiv, i) => {
					const value = inputDiv.props().children[0].props.value;
					if(value === vehicleNames[index]) {
						const input = inputDiv.find('input'),
							  speed = input.props()['data-speed'],
							  id = input.props()['data-id'];
						  
						const vehicleEvent = vehicleChangeEvent(vehicleNames[index], speed, id);
						input.simulate('change', vehicleEvent);
					}
				});
			});
			
			initialState = falcone.find(Falcone).instance().state;
			
			const assignRockets = falcone.find('.AssignRocket'),
				  assignRocket = assignRockets.at(changeRocketObj.destination-1),
				  inputElements = assignRocket.find('.AssignRocket__option');
			
			inputElements.forEach((inputDiv, i) => {
				const value = inputDiv.props().children[0].props.value;
				if(value === changeRocketObj.changeTo) {
					const input = inputDiv.find('input'),
						  speed = input.props()['data-speed'],
						  id = input.props()['data-id'];
					  
					const vehicleEvent = vehicleChangeEvent(changeRocketObj.changeTo, speed, id);
					input.simulate('change', vehicleEvent);
				}
			});
			finalState = falcone.find(Falcone).instance().state;
		});
		
		afterAll(() => {
			falcone.unmount();
		});
		
		it(`Vehicle_names should have ${changeRocketObj.changeTo} at index ${changeRocketObj.destination-1}, instead of ${changeRocketObj.changeFrom}`, () => {
			const changes = finalState.vehicle_names[changeRocketObj.destination-1];
			expect(changes).toBe(changeRocketObj.changeTo);
		});
		
		it('vehicles state should get updated', () => {
			const { destination, changeFrom, changeTo } = changeRocketObj,
			
				  changeFromStocks = getStocks(initialState, finalState, changeFrom),
				  changeFromInitialStock = changeFromStocks.initialStock,
				  changeFromFinalStock = changeFromStocks.finalStock,
				  
				  changeToStocks = getStocks(initialState, finalState, changeTo),
				  changeToInitialStock = changeToStocks.initialStock,
				  changeToFinalStock = changeToStocks.finalStock;
			
			expect(changeFromFinalStock).toBe(changeFromInitialStock+1);
			expect(changeToFinalStock).toBe(changeToInitialStock-1);
		});
		
		it(`Current destination ${changeRocketObj.changeTo} stock should reduce by 1, ${changeRocketObj.changeFrom} stock should increase by 1`, () => {
			const { destination, changeFrom, changeTo } = changeRocketObj,
				  initialObj = initialState.listOfVehicles[destination-1],
				  finalObj = finalState.listOfVehicles[destination-1],
				  
				  changeFromStocks = getStocks(initialObj, finalObj, changeFrom),
				  changeFromInitialStock = changeFromStocks.initialStock,
				  changeFromFinalStock = changeFromStocks.finalStock, 
				  
				  changeToStocks = getStocks(initialObj, finalObj, changeTo),
				  changeToInitialStock = changeToStocks.initialStock,
				  changeToFinalStock = changeToStocks.finalStock;
			
			expect(changeFromFinalStock).toBe(changeFromInitialStock+1);
			expect(changeToFinalStock).toBe(changeToInitialStock-1);
		});
		
		it(`Other destinations ${changeRocketObj.changeTo} stock should reduce by 1 and ${changeRocketObj.changeFrom} stock should increase by 1, if AssignRocket component has not been rendered yet or user has not selected any vehicle in other destination`, () => {
			const { changeFrom, changeTo, destination } = changeRocketObj;
			const state = falcone.find(Falcone).instance().state;
			let checks = true;
			
			state.listOfVehicles.forEach((vehicleObj, index) => {
				if(index !== destination-1) {
					if(vehicleObj.previousSelected.length === 0) {
						vehicleObj.vehicles.forEach((vehicle, vIndex) => {
							if(vehicle.name === changeFrom) {
								const initialStock = initialState.listOfVehicles[index].vehicles[vIndex].total_no;
								
								const finalStock = vehicle.total_no;
								
								if(finalStock !== initialStock+1) {
									checks = false;
								}
							}
							
							if(vehicle.name === changeTo) {
								const initialStock = initialState.listOfVehicles[index].vehicles[vIndex].total_no;
								
								const finalStock = vehicle.total_no;
								
								if(finalStock !== initialStock-1) {
									checks = false;
								}
							}
						});
					}
				}
			});
			expect(checks).toBe(true);
		});
	});
}

function rocketNotAvailable(planetNames, vehicleNames, destinations, changeRocketObj) {
	describe(`User change ${changeRocketObj.changeFrom} to ${changeRocketObj.changeTo} in destination-${changeRocketObj.destination}, that is not in stock`, () => {
		let initialState, finalState, falcone;
		
		beforeAll(() => {
			falcone = mount(
				<Router>
					<Falcone planets={planets} vehicles={vehicles} />
				</Router>
			);
			
			destinations.forEach((destination, index) => {
				const choosePlanets = falcone.find('.ChoosePlanet'),
					  choosePlanet = choosePlanets.at(destination-1),
					  selectElement = choosePlanet.find('.ChoosePlanet__Select'),
					  optionElements = selectElement.find('.ChoosePlanet__Option'),
					  planetEvent = planetChangeEvent(optionElements, planetNames[index], choosePlanet.props().id);
					  
				selectElement.simulate('change', planetEvent);
				
				const assignRockets = falcone.find('.AssignRocket'),
					  assignRocket = assignRockets.at(destination-1),
					  inputElements = assignRocket.find('.AssignRocket__option');
			
				inputElements.forEach((inputDiv, i) => {
					const value = inputDiv.props().children[0].props.value;
					if(value === vehicleNames[index]) {
						const input = inputDiv.find('input'),
							  speed = input.props()['data-speed'],
							  id = input.props()['data-id'];
						  
						const vehicleEvent = vehicleChangeEvent(vehicleNames[index], speed, id);
						input.simulate('change', vehicleEvent);
					}
				});
			});
			
			initialState = falcone.find(Falcone).instance().state;
			
			const assignRockets = falcone.find('.AssignRocket'),
				  assignRocket = assignRockets.at(changeRocketObj.destination-1),
				  inputElements = assignRocket.find('.AssignRocket__option');
			
			inputElements.forEach((inputDiv, i) => {
				const value = inputDiv.props().children[0].props.value;
				if(value === changeRocketObj.changeTo) {
					const input = inputDiv.find('input'),
						  speed = input.props()['data-speed'],
						  id = input.props()['data-id'];
					  
					const vehicleEvent = vehicleChangeEvent(changeRocketObj.changeTo, speed, id);
					input.simulate('change', vehicleEvent);
				}
			});
			finalState = falcone.find(Falcone).instance().state;
		});
		
		afterAll(() => {
			falcone.unmount();
		});
		
		it('showMessage state should have message - "Selected rocket is not available"', () => {
			expect(finalState.showMessage).toBe('Selected rocket is not available');
		});
	});
}

describe("Mount Falcone Component", () => {
	describe("User selects destination-1 planet", () => {
		const falcone = mount(
			<Router>
				<Falcone planets={planets} vehicles={vehicles} />
			</Router>
		);

		afterAll(() => {
			falcone.unmount();
		});
		
		selectPlanet(falcone, 'Donlon', 1, 'select', 1);
		selectPlanet(falcone, 'Enchai', 1, 'change', 1);
		selectPlanet(falcone, 'Donlon', 2, 'select', 2);
		selectPlanet(falcone, 'Jebing', 3, 'select', 3);
		selectPlanet(falcone, 'Sapir', 4, 'select', 4);
	});
	
	describe("User selects destination-2 planet", () => {
		const falcone = mount(
			<Router>
				<Falcone planets={planets} vehicles={vehicles} />
			</Router>
		);

		afterAll(() => {
			falcone.unmount();
		});
		
		selectPlanet(falcone, 'Donlon', 2, 'select', 1);
		selectPlanet(falcone, 'Enchai', 2, 'change', 1);
		selectPlanet(falcone, 'Pingasor', 1, 'select', 2);
		selectPlanet(falcone, 'Donlon', 3, 'select', 3);
		selectPlanet(falcone, 'Sapir', 4, 'select', 4);
	});
	
	describe("User select destinations planet and rocket", () => {
		const falcone = mount(
			<Router>
				<Falcone planets={planets} vehicles={vehicles} />
			</Router>
		);

		afterAll(() => {
			falcone.unmount();
		});
		
		selectRocket(falcone, 'Donlon', 1, 'Space pod');
		selectRocket(falcone, 'Enchai', 2, 'Space shuttle');
		selectRocket(falcone, 'Pingasor', 3, 'Space rocket');
		selectRocket(falcone, 'Sapir', 4, 'Space pod');
	});
	
	describe("User change a particular destination rocket", () => {
		const planetNames = ['Donlon', 'Enchai', 'Pingasor', 'Sapir'],
			  vehicleNames = ['Space pod', 'Space shuttle', 'Space rocket', 'Space pod'],
			  destinations = [1, 2, 3, 4],
			  changeRocketObj = {
				  destination: 1,
				  changeTo: 'Space ship',
				  changeFrom: 'Space pod'
			  }
			  
		changeRocket(planetNames, vehicleNames, destinations, changeRocketObj);
		
		planetNames[2] = 'Lerbin';
		vehicleNames[2] = 'Space ship';
		
		changeRocket(planetNames, vehicleNames, destinations, changeRocketObj);
	});
	
	describe('User select rocket that is not available', () => {
		const planetNames = ['Donlon', 'Enchai', 'Pingasor', 'Sapir'],
			  vehicleNames = ['Space pod', 'Space shuttle', 'Space rocket', 'Space pod'],
			  destinations = [1, 2, 3, 4],
			  changeRocketObj = {
				  destination: 1,
				  changeTo: 'Space pod',
				  changeFrom: 'Space shuttle'
			  }
		
		rocketNotAvailable(planetNames, vehicleNames, destinations, changeRocketObj);
		
		vehicleNames[3] = 'Space shuttle';
		changeRocketObj.destination = 3;
		changeRocketObj.changeTo = 'Space shuttle';
		changeRocketObj.changeFrom = 'Space rocket';
		
		rocketNotAvailable(planetNames, vehicleNames, destinations, changeRocketObj);
	});
	
	describe('User perform reset operation', () => {
		const falcone = mount(
			<Router>
				<Falcone planets={planets} vehicles={vehicles} />
			</Router>
		);

		afterAll(() => {
			falcone.unmount();
		});
		
		it('All state should reset to its initial state', () => {
			const initialState = falcone.find(Falcone).instance().state;
			
			// Manually changing the state
			initialState.planet_names = 'Donlon';
			initialState.vehicle_names = 'Space pod';
			
			const resetElem = falcone.find('.Navbar__reset');
			resetElem.simulate('click');
			
			const finalState = falcone.find(Falcone).instance().state;
			
			expect(finalState.planet_names.length).toBe(0);
			expect(finalState.vehicle_names.length).toBe(0);
		});
	});
});
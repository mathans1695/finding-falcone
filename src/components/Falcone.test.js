import React from 'react';
import { mount } from 'enzyme';
import { BrowserRouter as Router } from 'react-router-dom';
import Falcone from './Falcone';
import { getPlanets, getVehicles } from './../helpers';

const planets = getPlanets();
const vehicles = getVehicles();

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
		const choosePlanets = falcone.find('.ChoosePlanet'),
			  choosePlanet = choosePlanets.at(destination-1),
			  selectElement = choosePlanet.find('.ChoosePlanet__Select'),
			  optionElements = selectElement.find('.ChoosePlanet__Option'),
			  event = planetChangeEvent(optionElements, planetName, choosePlanet.props().id);
		
		beforeAll(() => {
			selectElement.simulate('change', event);
			falcone.update();
		});
		
		it(`planet_names state should have ${planetName} in it`, () => {
			const planetNames = falcone.find(Falcone).instance().state.planet_names;
			
			expect(planetNames.find(planet => planet === planetName)).toBe(planetName);
		});
		
		it('Assign Rockets should render after planet selection', () => {
			const assignRocket = falcone.find('.AssignRocket');
			expect(assignRocket.length).toBe(soFarRendered);
		});
			
		it(`Other destinations should not have ${planetName} option`, () => {
			const updatedPlanets = falcone.find('.ChoosePlanet');
			updatedPlanets.forEach((choosePlanet, index) => {
				let checks = true;
				if(index !== destination-1) {
					const optionElements = choosePlanet.find('.ChoosePlanet__Option');
					optionElements.forEach((optionElem) => {
						if(optionElem.prop('value') === planetName) {
							checks = false;
						}
					});
				}
				expect(checks).toBeTruthy();
			});
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
	describe(`User select ${planetName} planet and ${vehicleName} rocket`, () => {
		const choosePlanets = falcone.find('.ChoosePlanet'),
			  choosePlanet = choosePlanets.at(destination-1),
			  selectElement = choosePlanet.find('.ChoosePlanet__Select'),
			  optionElements = selectElement.find('.ChoosePlanet__Option'),
			  planetEvent = planetChangeEvent(optionElements, planetName, choosePlanet.props().id);
		
		let initialState;
		
		beforeAll(() => {
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
		});
		
		it(`Vehicle_names state should have ${vehicleName} rocket`, () => {
			const state = falcone.find(Falcone).instance().state;
			
			expect(state.vehicle_names.find(vehicle => vehicle === vehicleName)).toBe(vehicleName);
		});
		
		it('Time state should have the estimated time', () => {
			const state = falcone.find(Falcone).instance().state;
			
			expect(state.time.length).toBe(initialState.time.length+1);
		});
		
		it(`Current destination ${vehicleName} stock should reduce by 1`, () => {
			const state = falcone.find(Falcone).instance().state;
			
			const initialVehicle = initialState.listOfVehicles[destination-1].vehicles.find(vehicle => vehicle.name === vehicleName);
			
			const initialStock = initialVehicle.total_no;
			
			const selectedVehicle = state.listOfVehicles[destination-1].vehicles.find(vehicle => vehicle.name === vehicleName);
			
			const finalStock = +selectedVehicle.total_no;
			
			expect(finalStock).toBe(initialStock-1);
		});
		
		it(`Other destinations ${vehicleName} stock should reduce by 1, if AssignRocket component has not been rendered yet or user has not selected any vehicle in other destination`, () => {
			const state = falcone.find(Falcone).instance().state;
			state.listOfVehicles.forEach((vehicleObj, index) => {
				if(index !== destination-1) {
					if(vehicleObj.previousSelected.length === 0) {
						vehicleObj.vehicles.find((vehicle, vIndex) => {
							if(vehicle.name === vehicleName) {
								const initialStock = initialState.listOfVehicles[index].vehicles[vIndex].total_no;
								
								const finalStock = vehicle.total_no;
								
								expect(finalStock).toBe(initialStock-1);
							}
						});
					}
				}
			});
		});
	});
}

describe("Falcone Component", () => {
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
	
	describe("User selects destination-1 planet and rocket", () => {
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
	});
});
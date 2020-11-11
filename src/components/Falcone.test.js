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
});
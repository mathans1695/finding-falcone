import React from 'react';
import { mount } from 'enzyme';
import { BrowserRouter as Router } from 'react-router-dom';
import Falcone from './Falcone';
import { JSDOM } from 'jsdom';
import { getPlanets, getVehicles } from './../helpers';

const planets = getPlanets();
const vehicles = getVehicles();

// Creates synthetic event
function createEvent(optionElements, value, id) {
	const options = optionElements.map((optionElement, i) => {
		const temp = {};
		if(value === optionElement.props().value) {
			temp['selected'] = true;
		} else {
			temp['selected'] = false;
		}
		
		if(i != 0) {
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
		
		describe('User select Donlon planet in destination 1', () => {
			const choosePlanets = falcone.find('.ChoosePlanet'),
				  choosePlanet1 = choosePlanets.at(0),
				  selectElement1 = choosePlanet1.find('.ChoosePlanet__Select'),
				  optionElements = selectElement1.find('.ChoosePlanet__Option'),
				  event = createEvent(optionElements, 'Donlon', choosePlanet1.props().id);
			
			it('planet_names state should have Donlon in it', () => {
				selectElement1.simulate('change', event);
				falcone.update();
				
				expect(falcone.find(Falcone).instance().state.planet_names[0]).toBe('Donlon');
			});
			
			it('Other destinations should not have Donlon option', () => {
				const updatedPlanets = falcone.find('.ChoosePlanet');
				updatedPlanets.forEach((choosePlanet, index) => {
					if(index !== 0) {
						const optionElements = choosePlanet.find('.ChoosePlanet__Option');
						let checks = true;
						optionElements.forEach((optionElem) => {
							if(optionElem.prop('value') === 'Donlon') {
								checks = false;
							}
						});
						expect(checks).toBeTruthy();
					}
				});
			});
		});
		
		describe('User change destination 1 to Enchai', () => {
			const choosePlanets = falcone.find('.ChoosePlanet'),
				  choosePlanet1 = choosePlanets.at(0),
				  selectElement1 = choosePlanet1.find('.ChoosePlanet__Select'),
				  optionElements = selectElement1.find('.ChoosePlanet__Option'),
				  event = createEvent(optionElements, 'Enchai', choosePlanet1.props().id);
			
			it('planet_names state should have Enchai in it', () => {
				selectElement1.simulate('change', event);
				falcone.update();
				expect(falcone.find(Falcone).instance().state.planet_names[0]).toBe('Enchai');
			});
			
			it('Other destinations should not have Enchai option', () => {
				const updatedPlanets = falcone.find('.ChoosePlanet');
				updatedPlanets.forEach((choosePlanet, index) => {
					if(index !== 0) {
						const optionElements = choosePlanet.find('.ChoosePlanet__Option');
						let checks = true;
						optionElements.forEach((optionElem) => {
							if(optionElem.prop('value') === 'Enchai') {
								checks = false;
							}
						});
						expect(checks).toBeTruthy();
					}
				});
			});
		});
		
		describe('User select Donlon planet in destination 2', () => {
			const choosePlanets = falcone.find('.ChoosePlanet'),
				  choosePlanet2 = choosePlanets.at(1),
				  selectElement2 = choosePlanet2.find('.ChoosePlanet__Select'),
				  optionElements = selectElement2.find('.ChoosePlanet__Option'),
				  event = createEvent(optionElements, 'Donlon', choosePlanet2.props().id);
			
			it('planet_names state should have Donlon in it', () => {
				selectElement2.simulate('change', event);
				falcone.update();
				
				expect(falcone.find(Falcone).instance().state.planet_names[1]).toBe('Donlon');
			});
			
			it('Other destinations should not have Donlon option', () => {
				const updatedPlanets = falcone.find('.ChoosePlanet');
				updatedPlanets.forEach((choosePlanet, index) => {
					if(index !== 1) {
						const optionElements = choosePlanet.find('.ChoosePlanet__Option');
						let checks = true;
						optionElements.forEach((optionElem) => {
							if(optionElem.prop('value') === 'Donlon') {
								checks = false;
							}
						});
						expect(checks).toBeTruthy();
					}
				});
			});
		});
		
		describe('User select Jebing planet in destination 3', () => {
			const choosePlanets = falcone.find('.ChoosePlanet'),
				  choosePlanet3 = choosePlanets.at(2),
				  selectElement3 = choosePlanet3.find('.ChoosePlanet__Select'),
				  optionElements = selectElement3.find('.ChoosePlanet__Option'),
				  event = createEvent(optionElements, 'Jebing', choosePlanet3.props().id);
			
			it('planet_names state should have Jebing in it', () => {
				selectElement3.simulate('change', event);
				falcone.update();
				
				expect(falcone.find(Falcone).instance().state.planet_names[2]).toBe('Jebing');
			});
			
			it('Other destinations should not have Jebing option', () => {
				const updatedPlanets = falcone.find('.ChoosePlanet');
				updatedPlanets.forEach((choosePlanet, index) => {
					if(index !== 2) {
						const optionElements = choosePlanet.find('.ChoosePlanet__Option');
						let checks = true;
						optionElements.forEach((optionElem) => {
							if(optionElem.prop('value') === 'Jebing') {
								checks = false;
							}
						});
						expect(checks).toBeTruthy();
					}
				});
			});
		});
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
		
		describe('User select Donlon planet in destination 2', () => {
			const choosePlanets = falcone.find('.ChoosePlanet'),
				  choosePlanet2 = choosePlanets.at(1),
				  selectElement2 = choosePlanet2.find('.ChoosePlanet__Select'),
				  optionElements = selectElement2.find('.ChoosePlanet__Option'),
				  event = createEvent(optionElements, 'Donlon', choosePlanet2.props().id);
			
			it('planet_names state should have Donlon in it', () => {
				selectElement2.simulate('change', event);
				falcone.update();
				
				expect(falcone.find(Falcone).instance().state.planet_names[0]).toBe('Donlon');
			});
			
			it('Other destinations should not have Donlon option', () => {
				const updatedPlanets = falcone.find('.ChoosePlanet');
				updatedPlanets.forEach((choosePlanet, index) => {
					if(index !== 1) {
						const optionElements = choosePlanet.find('.ChoosePlanet__Option');
						let checks = true;
						optionElements.forEach((optionElem) => {
							if(optionElem.prop('value') === 'Donlon') {
								checks = false;
							}
						});
						expect(checks).toBeTruthy();
					}
				});
			});
		});
		
		describe('User change destination 2 to Enchai', () => {
			const choosePlanets = falcone.find('.ChoosePlanet'),
				  choosePlanet2 = choosePlanets.at(1),
				  selectElement2 = choosePlanet2.find('.ChoosePlanet__Select'),
				  optionElements = selectElement2.find('.ChoosePlanet__Option'),
				  event = createEvent(optionElements, 'Enchai', choosePlanet2.props().id);
			
			it('planet_names state should have Enchai in it', () => {
				selectElement2.simulate('change', event);
				falcone.update();
				expect(falcone.find(Falcone).instance().state.planet_names[0]).toBe('Enchai');
			});
			
			it('Other destinations should not have Enchai option', () => {
				const updatedPlanets = falcone.find('.ChoosePlanet');
				updatedPlanets.forEach((choosePlanet, index) => {
					if(index !== 1) {
						const optionElements = choosePlanet.find('.ChoosePlanet__Option');
						let checks = true;
						optionElements.forEach((optionElem) => {
							if(optionElem.prop('value') === 'Enchai') {
								checks = false;
							}
						});
						expect(checks).toBeTruthy();
					}
				});
			});
		});
	});
});
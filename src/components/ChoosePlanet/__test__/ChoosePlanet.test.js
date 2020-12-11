import React from 'react';
import toJson from 'enzyme-to-json';
import { shallow, mount } from 'enzyme';
import ChoosePlanet from '../ChoosePlanet';
import { initialPlanets, 
		 changePlanets, 
		 mockUpdateListOfPlanets,
		 mockUpdateListOfVehicles,
		 event } from './helper';

it('Renders initial rendering correctly', () => {
	const wrapper = shallow(<ChoosePlanet planets={initialPlanets} />);
	expect(toJson(wrapper)).toMatchSnapshot();
})

it('Select value equals curPlanet property of planets prop', () => {
	const wrapper = mount(<ChoosePlanet planets={changePlanets} />);
	const value = wrapper.find('.ChoosePlanet__Select').props.value;
	const curPlanet = wrapper.prop('planets').planets.curPlanet;
	
	// curPlanet property value was equal to select value
	expect(curPlanet).toEqual(value);
})

it('onchange event calls the corresponding methods passed as props with respective arguments', () => {
	const wrapper = shallow(
		<ChoosePlanet 
			planets={changePlanets} 
			updateListOfPlanets={mockUpdateListOfPlanets}
			updateListOfVehicles={mockUpdateListOfVehicles}
		/>
	);
	wrapper.find('.ChoosePlanet__Select').simulate('change', event);
	
	// The mock functions are called
	expect(mockUpdateListOfPlanets.mock.calls.length).toBe(1);
	expect(mockUpdateListOfVehicles.mock.calls.length).toBe(1);
	
	// The first argument to mockUpdateListOfPlanets was '111111'
	expect(mockUpdateListOfPlanets.mock.calls[0][0]).toBe('111111');
	// The second argument to mockUpdateListOfPlanets was 'Enchai'
	expect(mockUpdateListOfPlanets.mock.calls[0][1]).toBe('Enchai');	
	// The third argument to mockUpdateListOfPlanets was 200
	expect(mockUpdateListOfPlanets.mock.calls[0][2]).toBe(200);
	
	
	// The first argument to mockUpdateListOfVehicles was '111111'
	expect(mockUpdateListOfVehicles.mock.calls[0][0]).toBe('111111');
	// The second argument to mockUpdateListOfVehicles was 200
	expect(mockUpdateListOfVehicles.mock.calls[0][1]).toBe(200);
})
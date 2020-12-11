import React from 'react';
import toJson from 'enzyme-to-json';
import { shallow } from 'enzyme';
import ChoosePlanet from '../ChoosePlanet';
import { initialPlanets, 
		 changePlanets, 
		 mockUpdateListOfPlanets,
		 mockUpdateListOfVehicles } from './helper';

it('Renders initial rendering correctly', () => {
	const wrapper = shallow(<ChoosePlanet planets={initialPlanets} />);
	
	expect(toJson(wrapper)).toMatchSnapshot();
})

it('Renders correctly onChange', () => {
	const wrapper = shallow(<ChoosePlanet planets={changePlanets} />);
	
	expect(toJson(wrapper)).toMatchSnapshot();
})

it('Select value equals curPlanet property of Planets', () => {
	const wrapper = shallow(<ChoosePlanet planets={changePlanets} />);
	const value = wrapper.find('.ChoosePlanet__Select').props.value;
	const curPlanet = wrapper.props();
	console.log(curPlanet);
	
	expect(value).toEqual(curPlanet);
});
import React from 'react';
import toJson from 'enzyme-to-json';
import { shallow } from 'enzyme';
import Result from '../Result';
import { successJson, failureJson, time, total, mockReset} from './helper.js';

it('Renders success result page correctly', () => {
	const wrapper = shallow(<Result resultJSON={successJson} time={time} />);
	
	expect(toJson(wrapper)).toMatchSnapshot();
})

it('Renders failure result page correctly', () => {
	const wrapper = shallow(<Result resultJSON={failureJson} time={time} />);
	
	expect(toJson(wrapper)).toMatchSnapshot();
})

it('Time taken equals the sum of time props', () => {
	const wrapper = shallow(<Result resultJSON={failureJson} time={time} />);
	const timeTakenText = wrapper.find('.Result__time').text();
	
	expect(timeTakenText).toEqual(`Time taken: ${total}`);
})

it('Planet found equals the planet_names property of resultJSON', () => {
	const wrapper = shallow(<Result resultJSON={successJson} time={time} />);
	const planetFoundText = wrapper.find('.Result__planet').text();
	
	expect(planetFoundText).toEqual(`Planet found: ${successJson.planet_name}`);
})

it('Start Again should call reset function passed as prop', () => {
	const wrapper = shallow(<Result resultJSON={successJson} time={time} reset={mockReset} />);
	wrapper.find('.Result__startAgain').simulate('click');
	
	expect(mockReset.mock.calls.length).toEqual(1);
})
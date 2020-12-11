import React from 'react';
import toJson from 'enzyme-to-json';
import { shallow } from 'enzyme';
import Message from '../Message';
import { resetMsg, notAvailableMsg } from './helper';

it('Renders reset message correctly', () => {
	const wrapper = shallow(<Message msg={resetMsg} />);
	
	expect(toJson(wrapper)).toMatchSnapshot();
})

it('Renders not availble message correctly', () => {
	const wrapper = shallow(<Message msg={notAvailableMsg} />);
	
	expect(toJson(wrapper)).toMatchSnapshot();
})
import React from 'react';
import toJson from 'enzyme-to-json';
import { shallow } from 'enzyme';
import Navbar from '../Navbar';
import { mockReset } from './helper.js';

it('Renders correctly', () => {
	const wrapper = shallow(<Navbar />);
	
	expect(toJson(wrapper)).toMatchSnapshot();
})

it('Reset should call reset function passed as prop', () => {
	const wrapper = shallow(<Navbar reset={ mockReset }/>);
	wrapper.find('.Navbar__reset').simulate('click');
	
	expect(mockReset.mock.calls.length).toEqual(1);
})
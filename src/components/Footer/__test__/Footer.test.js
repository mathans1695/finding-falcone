import React from 'react';
import toJson from 'enzyme-to-json';
import { shallow } from 'enzyme';
import Footer from '../Footer';

it('Renders correctly', () => {
	const wrapper = shallow(<Footer />);
	
	expect(toJson(wrapper)).toMatchSnapshot();
})
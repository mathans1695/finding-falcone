import React from 'react';
import { mount } from 'enzyme';
import { BrowserRouter as Router } from 'react-router-dom';
import Falcone from './Falcone';

const planets = [
	{name: "Donlon", distance: 100},
	{name: "Enchai", distance: 200},
	{name: "Jebing", distance: 300},
	{name: "Sapir", distance: 400},
	{name: "Lerbin", distance: 500},
	{name: "Pingasor", distance: 600}
];

const vehicles = [
	{name: "Space pod", total_no: 2, max_distance: 200, speed: 2 },
	{name: "Space rocket", total_no: 1, max_distance: 300, speed: 4 },
	{name: "Space shuttle", total_no: 1, max_distance: 400, speed: 5 },
	{name: "Space ship", total_no: 2, max_distance: 600, speed: 10 }
];

it('<Falcone />', () => {
	const wrapper = mount(
		<Router>
			<Falcone planets={planets} vehicles={vehicles} />
		</Router>
	);
	
	wrapper.find('.Falcone').toMatchSnapshot();
})
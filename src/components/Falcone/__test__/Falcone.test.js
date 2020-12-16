import React from 'react';
import {render, fireEvent, screen} from '@testing-library/react';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import Falcone from '../Falcone';
import { planets, vehicles, selectedPlanets } from './helper';
		 
it("renders correctly", () => {
	const history = createMemoryHistory();
	render(
		<Router history={history}>
			<Falcone planets={planets} vehicles={vehicles} />
		</Router>
	);
})

it("select four planets and four vehicles to enable Find Falcone button", async () => {
	const history = createMemoryHistory();
	render(
		<Router history={history}>
			<Falcone planets={planets} vehicles={vehicles} />
		</Router>
	);
	
	// unable to click 'Find Falcone' button
	expect(screen.getByText('Find Falcone').disabled).toBeTruthy();
	
	// select four planets in each destination
	const choosePlanets = screen.getAllByDisplayValue('Choose Planet');
	choosePlanets.forEach((selectElem, i) => {
		fireEvent.change(selectElem, { target: {value: selectedPlanets[i]}});
	})
	
	// selectedPlanets has been selected in corresponding destinations
	selectedPlanets.forEach(planet => {
		expect(screen.getByDisplayValue(planet)).toBeTruthy();
	})
	
	// select four vehicles in each destination
	// select Space pod in destination-1
	fireEvent.click(screen.getAllByLabelText('Space pod (2)')[0], { target: {value: 'Space pod'}});
	// Total time = 50 means then Space pod is selected
	expect(screen.getByText('Total Time: 50')).toBeTruthy();
	
	// select Space rocket in destination-2
	fireEvent.click(screen.getAllByLabelText('Space rocket (1)')[1], { target: {value: 'Space rocket'}});
	// Total time = 100 means, Space rocket is selected
	expect(screen.getByText('Total Time: 100')).toBeTruthy();
	
	// select Space ship in destination-3
	fireEvent.click(screen.getAllByLabelText('Space ship (2)')[2], { target: {value: 'Space ship'}});
	// Total time = 140 means, Space ship is selected
	expect(screen.getByText('Total Time: 140')).toBeTruthy();
	
	// select Space ship in destination-4
	fireEvent.click(screen.getAllByLabelText('Space ship (1)')[1], { target: {value: 'Space ship'}});
	// Total time = 200 means, Space ship is selected
	expect(screen.getByText('Total Time: 200')).toBeTruthy();
	
	// Now, you can click the Find Falcone button
	expect(screen.getByText('Find Falcone').disabled).toBeFalsy();
})
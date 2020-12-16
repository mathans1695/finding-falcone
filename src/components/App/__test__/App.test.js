import React from 'react';
import _ from 'lodash';
import ReactDOM, { scryRenderedDOMComponentsWithClass } from 'react-dom';
import toJson from 'enzyme-to-json';
import {render, cleanup, fireEvent} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { screen } from '@testing-library/react';
import { Router } from 'react-router-dom';
import { shallow, mount } from 'enzyme';
import { createMemoryHistory } from 'history';
import { act, Simulate } from 'react-dom/test-utils';
import { generatePlanetEvents, selectedPlanets } from './helper';
import App from '../App';

jest.mock('../../../utils/api_requests');

it('renders correctly', async () => {
	const history = createMemoryHistory();
	await act(async () => {
		render(
			<Router history={history}>
				<App />
			</Router>
		);
	});
	expect(screen).toMatchSnapshot();
})

it('select four planets and four vehicles to click the button Falcone and check whether success page gets rendered correctly', async () => {
	const history = createMemoryHistory();
	await act(async () => {
		render(
			<Router history={history}>
				<App />
			</Router>
		);
	});
	
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
	
	await act(async () => {
		fireEvent.click(screen.getByText('Find Falcone'));
	})
	
	// shows success page with success message
	expect(screen.getByText('Success! Congratulations on Finding Falcone. King Shan is mighty pleased.')).toBeTruthy();
})
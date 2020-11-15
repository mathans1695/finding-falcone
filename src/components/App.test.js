import React from 'react';
import { mount } from 'enzyme';
import ReactDOM from 'react-dom';
import App from './App';

describe('App component', () => {
	it('some', async () => {
		const app = await mount(<App />);
		
		console.log(app);
	}, 2000);
});
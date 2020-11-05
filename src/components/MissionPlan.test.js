import React from 'react';
import { mount } from 'enzyme';
import _ from 'lodash';
import MissionPlan from './MissionPlan';

const planets = [
	{name: "Donlon", distance: 100},
	{name: "Enchai", distance: 200},
	{name: "Jebing", distance: 300},
	{name: "Sapir", distance: 400},
	{name: "Lerbin", distance: 500},
	{name: "Pingasor", distance: 600}
];
	
const listOfPlanet = {
	planets: _.cloneDeep(planets),
	id: '',
	previousSelected: [],
	curPlanet: "Choose Planet"
};
	
const listOfPlanets = [];
for (let i=0; i<4; i++) {
	listOfPlanets[i] = _.cloneDeep(listOfPlanet);
	listOfPlanets[i]['id'] = i;
}

const vehicles = [
	{name: "Space pod", total_no: 2, max_distance: 200, speed: 2 },
	{name: "Space rocket", total_no: 1, max_distance: 300, speed: 4 },
	{name: "Space shuttle", total_no: 1, max_distance: 400, speed: 5 },
	{name: "Space ship", total_no: 2, max_distance: 600, speed: 10 }
];

vehicles['showAlways'] = false;

const listOfVehicle = {
	vehicles: _.cloneDeep(vehicles),
	id: '',
	isRendered: false,
	previousSelected: []
}

const listOfVehicles = [];
for (let i=0; i<4; i++) {
	listOfVehicles[i] = _.cloneDeep(listOfVehicle);
	listOfVehicles[i]['id'] = i;
}

it('testing missionplan', () => {
	const wrapper = mount(<MissionPlan listOfVehicles={listOfVehicles} listOfPlanets={listOfPlanets} time={[]} />);
})
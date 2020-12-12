import React from 'react';
import { shallow } from 'enzyme';
import MissionPlan from '../MissionPlan';
import { planets,
		 vehicles,
		 time,
		 mockUpdateMessage,
		 mockUpdateSelectedPlanets,
		 mockUpdateSelectedVehicles,
		 mockUpdateTime,
		 getIndex } from './helper';
		 
it('invoking updateListOfPlanets directly, calls the updateSelectedPlanets method passed as props to MissionPlan', () => {
	const wrapper = shallow(
		<MissionPlan 
			planets={planets}
			vehicles={vehicles}
			time={time}
			updateSelectedPlanets={mockUpdateSelectedPlanets}
		/>
	);
	
	const instance = wrapper.instance();
	const id = instance.state.listOfPlanets[0].id;
	instance.updateListOfPlanets(id, 'Donlon', 200);
	 
	// mock calls length is 1
	expect(mockUpdateSelectedPlanets.mock.calls.length).toBe(1);
})

it('invoking updateListOfPlanets directly, updates the state of listOfPlanets based on the arguments passed to the method', () => {
	const wrapper = shallow(
		<MissionPlan 
			planets={planets}
			vehicles={vehicles}
			time={time}
			updateSelectedPlanets={mockUpdateSelectedPlanets}
		/>
	);
	
	const instance = wrapper.instance();
	const listOfPlanetsState = instance.state.listOfPlanets;
	// get destination-1 id
	const id = listOfPlanetsState[0].id;
	const updateListOfPlanetsFn = instance.updateListOfPlanets;
	
	// initial listOfPlanets state of planets object at destination-1
	// curPlanet property is 'Choose Planet'
	expect(listOfPlanetsState[0].curPlanet).toEqual('Choose Planet');
	// previousSelected property array length is 0
	expect(listOfPlanetsState[0].previousSelected.length).toBe(0);
	
	// initial listOfPlanets state of other destinations planets object
	// other planets array length is 6 - (other than index - 0)
	expect(listOfPlanetsState[1].planets.length).toBe(6);
	expect(listOfPlanetsState[2].planets.length).toBe(6);
	expect(listOfPlanetsState[3].planets.length).toBe(6);
	
	// invoking updateListOfPlanets method
	updateListOfPlanetsFn(id, 'Donlon', 200);
	// get new state of listOfPlanets
	const newListOfPlanetsState = instance.state.listOfPlanets;
	
	// listOfPlanets state of planets object at destination-1
	// curPlanet property is 'Donlon'
	expect(newListOfPlanetsState[0].curPlanet).toEqual('Donlon');
	// previousSelected property array length is 1
	expect(newListOfPlanetsState[0].previousSelected.length).toBe(1);
	
	// listOfPlanets state of other destinations planets object
	// other planets array length is 5 - (other than index - 0)
	expect(newListOfPlanetsState[1].planets.length).toBe(5);
	expect(newListOfPlanetsState[2].planets.length).toBe(5);
	expect(newListOfPlanetsState[3].planets.length).toBe(5);
})

it('invoking handleRocketChange directly, calls the updateSelectedVehicles and updateTime method passed as props to MissionPlan', () => {
	const wrapper = shallow(
		<MissionPlan 
			planets={planets}
			vehicles={vehicles}
			time={time}
			updateSelectedVehicles={mockUpdateSelectedVehicles}
			updateTime={mockUpdateTime}
			updateMessage={mockUpdateMessage}
		/>
	);
	
	const instance = wrapper.instance();
	// get destination-1 id
	const id = instance.state.listOfVehicles[0].id;
	const handleRocketChangeFn = instance.handleRocketChange;
	
	// invoking handleRocketChangeFn
	handleRocketChangeFn(id, 'Space pod', 2, 200);
	
	expect(mockUpdateSelectedVehicles.mock.calls.length).toBe(1);
	expect(mockUpdateTime.mock.calls.length).toBe(1);
})

it('invoking handleRocketChange directly, updates the vehicles state based on the arguments passed', () => {
	const wrapper = shallow(
		<MissionPlan 
			planets={planets}
			vehicles={vehicles}
			time={time}
			updateSelectedVehicles={mockUpdateSelectedVehicles}
			updateTime={mockUpdateTime}
			updateMessage={mockUpdateMessage}
		/>
	);
	
	const instance = wrapper.instance();
	const vehiclesState = instance.state.vehicles;
	// get destination-1 id
	const id = instance.state.listOfVehicles[0].id;
	const handleRocketChangeFn = instance.handleRocketChange;
	
	const index = getIndex(vehicles, 'Space pod');
	
	// initial vehicles state
	// Space pod stock is 2
	expect(vehiclesState[index].total_no).toBe(2);
	
	// invoking handleRocketChangeFn
	handleRocketChangeFn(id, 'Space pod', 2, 200);
	
	// get new state of vehicles
	const newVehiclesState = instance.state.vehicles;
	
	// vehicles state after invoking handleRocketChange function
	// Space pod stock is 1
	expect(newVehiclesState[index].total_no).toBe(1);
})

it('invoking handleRocketChange directly, updates the listOfVehicles state based on the arguments passed and on certain conditions', () => {
	const wrapper = shallow(
		<MissionPlan 
			planets={planets}
			vehicles={vehicles}
			time={time}
			updateSelectedVehicles={mockUpdateSelectedVehicles}
			updateTime={mockUpdateTime}
			updateMessage={mockUpdateMessage}
		/>
	);
	
	const instance = wrapper.instance();
	const listOfVehiclesState = instance.state.listOfVehicles;
	// get destination - 1 id
	const id = listOfVehiclesState[0].id;
	const handleRocketChangeFn = instance.handleRocketChange;
	
	/* initial listOfVehicles state at destinations 1
	 * when previousSelected property is null
	 */
	const index = getIndex(listOfVehiclesState[0].vehicles, 'Space pod');
	// previousSelected property is null
	expect(listOfVehiclesState[0].previousSelected).toEqual("");
	// 'Space pod' vehicle stock is 2
	expect(listOfVehiclesState[0].vehicles[index].total_no).toBe(2);
	// 'Space pod' vehicle showAlways property is false
	expect(listOfVehiclesState[0].vehicles[index].showAlways).toBeFalsy();
	
	// initial listOfVehicles state at other destinations
	// 'Space rod' vehicle stock is 2
	expect(listOfVehiclesState[1].vehicles[index].total_no).toBe(2);
	expect(listOfVehiclesState[2].vehicles[index].total_no).toBe(2);
	expect(listOfVehiclesState[3].vehicles[index].total_no).toBe(2);
	
	// invoking handleRocketChange method
	handleRocketChangeFn(id, 'Space pod', 2, 200);
	
	// get new listOfVehicles state
	const newListOfPlanetsState = instance.state.listOfVehicles;
	
	// listOfVehicles state at destination-1
	// previousSelected property is 'Space pod'
	expect(newListOfPlanetsState[0].previousSelected).toEqual("Space pod");
	// 'Space pod' vehicle stock reduces by 1
	expect(newListOfPlanetsState[0].vehicles[index].total_no).toBe(1);
	// 'Space pod' vehicle showAlways property is true
	expect(newListOfPlanetsState[0].vehicles[index].showAlways).toBeTruthy();
	
	// listOfVehicles state at other destinations
	// 'Space rod' vehicle stock reduces by 1
	expect(newListOfPlanetsState[1].vehicles[index].total_no).toBe(1);
	expect(newListOfPlanetsState[2].vehicles[index].total_no).toBe(1);
	expect(newListOfPlanetsState[3].vehicles[index].total_no).toBe(1);
	
	// when previousSelected is not null, in this case 'Space pod' at destination-1
	// invoking handleRocketChange method to change rocket to 'Space shuttle'
	handleRocketChangeFn(id, 'Space shuttle', 4, 200);
	
	// get new listOfVehicles state
	const newListOfPlanetsState1 = instance.state.listOfVehicles;
	// get index of 'Space shuttle'
	const spaceShuttleIndex = getIndex(newListOfPlanetsState1[0].vehicles, 'Space shuttle');
	
	// listOfVehicles state at destination-1
	// previousSelected property is 'Space shuttle'
	expect(newListOfPlanetsState1[0].previousSelected).toEqual("Space shuttle");
	// 'Space pod' vehicle stock increases by 1
	expect(newListOfPlanetsState1[0].vehicles[index].total_no).toBe(2);
	// 'Space shuttle' vehicle stock decreases by 1
	expect(newListOfPlanetsState1[0].vehicles[spaceShuttleIndex].total_no).toBe(0);
	// 'Space pod' vehicle showAlways property is false
	expect(newListOfPlanetsState1[0].vehicles[index].showAlways).toBeFalsy();
	// 'Space shuttle' vehicle showAlways property is true
	expect(newListOfPlanetsState1[0].vehicles[spaceShuttleIndex].showAlways).toBeTruthy();
	
	// listOfVehicles state at other destinations
	// 'Space rod' vehicle stock increases by 1
	expect(newListOfPlanetsState1[1].vehicles[index].total_no).toBe(2);
	expect(newListOfPlanetsState1[2].vehicles[index].total_no).toBe(2);
	expect(newListOfPlanetsState1[3].vehicles[index].total_no).toBe(2);
	// 'Space shuttle' vehicle stock decreases by 1
	expect(newListOfPlanetsState1[1].vehicles[spaceShuttleIndex].total_no).toBe(0);
	expect(newListOfPlanetsState1[2].vehicles[spaceShuttleIndex].total_no).toBe(0);
	expect(newListOfPlanetsState1[3].vehicles[spaceShuttleIndex].total_no).toBe(0);
})

it('invoking updateListOfVehicles directly, changes listOfVehicles and vehicles state', () => {
	const wrapper = shallow(
		<MissionPlan 
			planets={planets}
			vehicles={vehicles}
			time={time}
			updateSelectedVehicles={mockUpdateSelectedVehicles}
			updateTime={mockUpdateTime}
		/>
	);
	
	const instance = wrapper.instance();
	const listOfVehiclesState = instance.state.listOfVehicles;
	// get destination - 1 id
	const id = listOfVehiclesState[0].id;
	const updateListOfVehiclesFn = instance.updateListOfVehicles;
	const handleRocketChangeFn = instance.handleRocketChange;
	
	// initial listOfVehicles state at destinations-1
	// isRendered property is false
	expect(listOfVehiclesState[0].isRendered).toBeFalsy();
	// planetDistance property is not exists
	expect(listOfVehiclesState[0].planetDistance).toBeUndefined();
	
	// invoke updateListOfVehicles method
	// consider 'Donlon' planet selected at destination-1
	updateListOfVehiclesFn(id, 200);
	
	// get new listOfVehicles state
	const newListOfVehiclesState = instance.state.listOfVehicles;
	// isRendered property is true
	expect(newListOfVehiclesState[0].isRendered).toBeTruthy();
	// planetDistance property exists
	expect(newListOfVehiclesState[0].planetDistance).toEqual(200);
	
	// select 'Space pod' rocket at destination-1 by invoking handleRocketChange method
	handleRocketChangeFn(id, 'Space pod', 2, 200);
	
	// get updated listOfVehicles state
	const newListOfVehiclesState1 = instance.state.listOfVehicles;
	const index = getIndex(newListOfVehiclesState1[0].vehicles, 'Space pod');
	// get global vehicles state
	const vehiclesState = instance.state.vehicles;
	
	// 'Space pod' global vehicles state stock reduces by 1
	expect(vehiclesState[index].total_no).toBe(1);
	// 'Space pod' stock reduces by 1 in all destinations, if user not selected any rockets in other destinations
	expect(newListOfVehiclesState1[0].vehicles[index].total_no).toBe(1);
	expect(newListOfVehiclesState1[1].vehicles[index].total_no).toBe(1);
	expect(newListOfVehiclesState1[2].vehicles[index].total_no).toBe(1);
	expect(newListOfVehiclesState1[3].vehicles[index].total_no).toBe(1);
	// 'Space pod' vehicle showAlways property at destination-1 is true
	expect(newListOfVehiclesState1[0].vehicles[index].showAlways).toBeTruthy();
	
	// invoke updateListOfVehicles method again at destination-1
	// consider 'Pingasor' planet selected at destination-1
	updateListOfVehiclesFn(id, 600);
	
	// get updated listOfVehicles state
	const newListOfVehiclesState2 = instance.state.listOfVehicles;
	// get global vehicles state
	const vehiclesState1 = instance.state.vehicles;
	
	// 'Space pod' cannot be assigned to 'Pingasor'
	// 'Space pod' global vehicles state stock increases by 1
	expect(vehiclesState1[index].total_no).toBe(2);
	// 'Space pod' stock increases by 1 in all destinations, if user not selected any rockets in other destinations
	expect(newListOfVehiclesState2[0].vehicles[index].total_no).toBe(2);
	expect(newListOfVehiclesState2[1].vehicles[index].total_no).toBe(2);
	expect(newListOfVehiclesState2[2].vehicles[index].total_no).toBe(2);
	expect(newListOfVehiclesState2[3].vehicles[index].total_no).toBe(2);
	// 'Space pod' vehicle showAlways property at destination-1 is false
	expect(newListOfVehiclesState2[0].vehicles[index].showAlways).toBeFalsy();
})
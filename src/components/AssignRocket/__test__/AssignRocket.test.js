import React from 'react';
import { shallow } from 'enzyme';
import AssignRocket from '../AssignRocket';
import { initialVehicles, 
		 selectVehicles,
		 disableParticularVehicle,
		 event,
		 mockHandleVehicleUpdation } from './helper';

it('Show available vehicles', () => {
	const wrapper = shallow(<AssignRocket vehicles={initialVehicles} />);
	const assignRocketWrapper = wrapper.find('.AssignRocket');
	
	// first vehicle was not disabled
	expect(assignRocketWrapper.childAt(0).childAt(0).prop('disabled')).toBeUndefined();
	// second vehicle was not disabled
	expect(assignRocketWrapper.childAt(1).childAt(0).prop('disabled')).toBeUndefined();
	// third vehicle was not disabled
	expect(assignRocketWrapper.childAt(2).childAt(0).prop('disabled')).toBeUndefined();
	// fourth vehicle was not disabled
	expect(assignRocketWrapper.childAt(3).childAt(0).prop('disabled')).toBeUndefined();
})

it('Disable not available vehicles', () => {
	const wrapper = shallow(<AssignRocket vehicles={disableParticularVehicle} />);
	const assignRocketWrapper = wrapper.find('.AssignRocket');
	
	// first vehicle was disabled
	expect(assignRocketWrapper.childAt(0).childAt(0).prop('disabled')).toBeTruthy();
	// second vehicle was disabled
	expect(assignRocketWrapper.childAt(1).childAt(0).prop('disabled')).toBeTruthy();
	// third vehicle was not disabled
	expect(assignRocketWrapper.childAt(2).childAt(0).prop('disabled')).toBeUndefined();
	// fourth vehicle was not disabled
	expect(assignRocketWrapper.childAt(3).childAt(0).prop('disabled')).toBeUndefined();
})

it('Selected vehicle get checked', () => {
	const wrapper = shallow(<AssignRocket vehicles={selectVehicles} />);
	const assignRocketWrapper = wrapper.find('.AssignRocket');
	
	// first vehicle was selected, checked value was true
	expect(assignRocketWrapper.childAt(0).childAt(0).prop('checked')).toBeTruthy();
})

it('onchange event call the method passed as props with respective arguments', () => {
	const wrapper = shallow(
		<AssignRocket 
			vehicles={initialVehicles} 
			handleVehicleUpdation={mockHandleVehicleUpdation}
		/>
	);
	const assignRocketWrapper = wrapper.find('.AssignRocket');
	assignRocketWrapper.childAt(1).childAt(0).simulate('change', event);
	
	// The mock function was called
	expect(mockHandleVehicleUpdation.mock.calls.length).toBe(1);
	
	// The first argument to mock function is '111111'
	expect(mockHandleVehicleUpdation.mock.calls[0][0]).toEqual('111111');
	// The second argument to mock function is 'Space rocket'
	expect(mockHandleVehicleUpdation.mock.calls[0][1]).toEqual('Space rocket');
	// The third argument to mock function is 4
	expect(mockHandleVehicleUpdation.mock.calls[0][2]).toEqual(4);
	// The fourth argument to mock function is 400
	expect(mockHandleVehicleUpdation.mock.calls[0][3]).toEqual(400);
})
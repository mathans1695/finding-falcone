import _ from 'lodash';

const vehicles = [
	{name: "Space pod", total_no: 2, max_distance: 200, speed: 2, isPossible: false, showAlways: false},
	{name: "Space rocket", total_no: 1, max_distance: 300, speed: 4, isPossible: false, showAlways: false },
	{name: "Space shuttle", total_no: 1, max_distance: 400, speed: 5, isPossible: false, showAlways: false },
	{name: "Space ship", total_no: 2, max_distance: 600, speed: 10, isPossible: false, showAlways: false }
];
const id = '111111';

const generateVehicles = (planetDistance, selected) => {
	let vehiclesObj = {
		id: id,
		planetDistance: planetDistance,
		vehicles: _.cloneDeep(vehicles),
		previousSelected: ''
	}
	
	vehiclesObj.vehicles.forEach(vehicle => {
		if(vehicle.max_distance >= planetDistance && vehicle.total_no > 0) {
			vehicle.isPossible = true;
		}
	});
	
	if(selected) {
		vehiclesObj.vehicles.forEach(vehicle => {
			if(vehicle.isPossible && vehicle.name === selected){
				vehicle.showAlways = true;
				vehicle.total_no -= 1;
				vehiclesObj.previousSelected = selected;
			}
		})
	}
	
	return vehiclesObj
}

export const initialVehicles = generateVehicles(200);
export const selectVehicles = generateVehicles(200, 'Space pod');
export const disableParticularVehicle = generateVehicles(400, 'Space pod');

export const event = {
	target: {
		value: 'Space rocket',
		getAttribute: (attr) => {
			if(attr === 'data-id') return '111111';
			if(attr === 'data-speed') return 4;
		}
	}
}

export const mockHandleVehicleUpdation = jest.fn((id, rocket, speed, distance) => undefined);
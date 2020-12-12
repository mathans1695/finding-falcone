export const vehicles = [
	{name: "Space pod", total_no: 2, max_distance: 200, speed: 2 },
	{name: "Space rocket", total_no: 1, max_distance: 300, speed: 4 },
	{name: "Space shuttle", total_no: 1, max_distance: 400, speed: 5 },
	{name: "Space ship", total_no: 2, max_distance: 600, speed: 10 }
];

export const planets = [
	{name: "Donlon", distance: 100},
	{name: "Enchai", distance: 200},
	{name: "Jebing", distance: 300},
	{name: "Sapir", distance: 400},
	{name: "Lerbin", distance: 500},
	{name: "Pingasor", distance: 600}
];

export const time = [0, 0, 0, 0];

export const mockUpdateMessage = jest.fn((msg) => undefined);
export const mockUpdateSelectedPlanets = jest.fn((index, value) => undefined);
export const mockUpdateSelectedVehicles = jest.fn((index, value) => undefined);
export const mockUpdateTime = jest.fn((index, value) => undefined);

export const getIndex = (vehicles, name) => vehicles.findIndex(vehicle => vehicle.name === name);
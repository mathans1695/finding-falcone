export const globalVehicles = [
	{name: "Space pod", total_no: 2, max_distance: 200, speed: 2 },
	{name: "Space rocket", total_no: 1, max_distance: 300, speed: 4 },
	{name: "Space shuttle", total_no: 1, max_distance: 400, speed: 5 },
	{name: "Space ship", total_no: 2, max_distance: 600, speed: 10 }
];

export const indivVehicles = [
	{name: "Space pod", total_no: 2, max_distance: 200, speed: 2, isPossible: false, showAlways: false},
	{name: "Space rocket", total_no: 1, max_distance: 300, speed: 4, isPossible: false, showAlways: false },
	{name: "Space shuttle", total_no: 1, max_distance: 400, speed: 5, isPossible: false, showAlways: false },
	{name: "Space ship", total_no: 2, max_distance: 600, speed: 10, isPossible: false, showAlways: false }
];

export const getIndex = (vehicles, name) => vehicles.findIndex(vehicle => vehicle.name === name);
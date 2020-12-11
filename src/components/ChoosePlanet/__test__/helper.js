const planets = [
	{name: "Donlon", distance: 100},
	{name: "Enchai", distance: 200},
	{name: "Jebing", distance: 300},
	{name: "Sapir", distance: 400},
	{name: "Lerbin", distance: 500},
	{name: "Pingasor", distance: 600}
]
const id = "111111";

export const initialPlanets = {
	curPlanet: "Choose Planet",
	id: id,
	planets: planets,
	previousSelected: []
}

export const changePlanets = {
	curPlanet: "Donlon",
	id: id,
	planets: planets,
	previousSelected: [{name: "Donlon", distance: 100}]
}

export const mockUpdateListOfPlanets = jest.fn((id, value, distance) => undefined);
export const mockUpdateListOfVehicles = jest.fn((id, distance) => undefined);

export const event = {
	target: {
		parentElement: { id },
		options: [
			{ selected: false },
			{ selected: false },
			{ selected: true, getAttribute: () => 200 },
			{ selected: false },
			{ selected: false },
			{ selected: false },
			{ selected: false }
		],
		value: 'Enchai'
	}
}
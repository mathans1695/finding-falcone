function uuid() {
	let firstPart = Math.floor(Math.random() * 1e6);
	let secondPart = Math.floor(Math.random() * 1e6);
	
	let uniqueID = String(firstPart + secondPart);
	if(uniqueID.length > 6) uniqueID = uniqueID.slice(0, -1);
	
	return uniqueID;
}

function getPlanets() {
	return [
		{name: "Donlon", distance: 100},
		{name: "Enchai", distance: 200},
		{name: "Jebing", distance: 300},
		{name: "Sapir", distance: 400},
		{name: "Lerbin", distance: 500},
		{name: "Pingasor", distance: 600}
	];
	
}

function getVehicles() {
	return [
		{name: "Space pod", total_no: 2, max_distance: 200, speed: 2 },
		{name: "Space rocket", total_no: 1, max_distance: 300, speed: 4 },
		{name: "Space shuttle", total_no: 1, max_distance: 400, speed: 5 },
		{name: "Space ship", total_no: 2, max_distance: 600, speed: 10 }
	];
}

export { uuid, getPlanets, getVehicles };
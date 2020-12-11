export const changeGlobalVehicles = (vehicles, rocket, previousSelected) => {
	if(previousSelected) {
		vehicles.forEach(vehicle => {
			if(previousSelected === vehicle.name) {
				vehicle.total_no += 1;
			} else if(vehicle.name === rocket) {
				vehicle.total_no -= 1;
			}
		});
	} else {
		vehicles.forEach(vehicle => {
			if(vehicle.name === rocket) {
				vehicle.total_no -= 1;
			}
		});
	}
}

export const changeIndivVehicles = (globalVehicles, indivVehicles, rocket, previousSelected, updateShowAlways=false) => {
	if(previousSelected) {
		indivVehicles.forEach((vehicle, index) => {
			if(previousSelected === vehicle.name) {
				vehicle.total_no = globalVehicles[index].total_no;
				updateShowAlways && (vehicle.showAlways = false);
			} else if(vehicle.name === rocket) {
				vehicle.total_no = globalVehicles[index].total_no;
				updateShowAlways && (vehicle.showAlways = true);
			}
		});
	} else {
		indivVehicles.forEach((vehicle, index) => {
			if(vehicle.name === rocket) {
				vehicle.total_no = globalVehicles[index].total_no;
				updateShowAlways && (vehicle.showAlways = true);
			}
		});
	}
}
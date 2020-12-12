import { changeGlobalVehicles, changeIndivVehicles } from '../MissionPlanHelper';
import { globalVehicles, 
		 indivVehicles,
		 getIndex } from './helper1';

// changeGlobalVehicles helper function tests
it('change the global vehicles object in place with the parameters passed to the function', () => {
	const index = getIndex(globalVehicles, 'Space rocket');
	
	// initial stock of Space rocket is 1
	expect(globalVehicles[index].total_no).toEqual(1);
	// reduce Space rocket total_no by 1
	changeGlobalVehicles(globalVehicles, "Space rocket", "");
	// Space rocket stock reduces by 1
	expect(globalVehicles[index].total_no).toEqual(0);
})

it('change the global vehicles object in place with parameters passed with previousSelected param', () => {
	const rocketIndex = getIndex(globalVehicles, 'Space shuttle');
	const previousRocketIndex = getIndex(globalVehicles, 'Space rocket');
	
	// initial stock of Space rocket(previous) is 0
	expect(globalVehicles[previousRocketIndex].total_no).toEqual(0);
	// initial stock of Space shuttle(current selected) is 1
	expect(globalVehicles[rocketIndex].total_no).toEqual(1);
	
	// change Space rocket to Space shuttle
	changeGlobalVehicles(globalVehicles, "Space shuttle", "Space rocket");
	
	// final stock of Space rocket(previous) is 1
	expect(globalVehicles[previousRocketIndex].total_no).toEqual(1);
	// final stock of Space shuttle(current selected) is 0
	expect(globalVehicles[rocketIndex].total_no).toEqual(0);
})

// changeIndivVehicles helper function tests
it('indivVehicles copy the stocks from globalVehicles passed as parameters based on rocket and previousSelected params', () => {
	const rocketIndex = getIndex(globalVehicles, 'Space shuttle');
	const previousRocketIndex = getIndex(globalVehicles, 'Space rocket');
	
	// initial stock of Space rocket in indivVehicles is 1
	expect(indivVehicles[previousRocketIndex].total_no).toEqual(1);
	// initial stock of Space shuttle in indivVehicles is 1
	expect(indivVehicles[rocketIndex].total_no).toEqual(1);
	
	changeIndivVehicles(globalVehicles, indivVehicles, 'Space shuttle', 'Space rocket');
	
	// indivVehicles Space rocket stock equals globalVehicles stock
	expect(indivVehicles[previousRocketIndex].total_no).toEqual(globalVehicles[previousRocketIndex].total_no);
	// indivVehicles Space shuttle stock equals globalVehicles stock
	expect(indivVehicles[rocketIndex].total_no).toEqual(globalVehicles[rocketIndex].total_no);
})

it('update the showAlways property of indivVehicles, if passed as params', () => {
	const index = getIndex(globalVehicles, 'Space rocket');
	
	// Space rocket showAlways property is false
	expect(indivVehicles[index].showAlways).toBeFalsy();
	
	changeIndivVehicles(globalVehicles, indivVehicles, 'Space rocket', '', true);
	
	// Space rocket showAlways property is true
	expect(indivVehicles[index].showAlways).toBeTruthy();
})
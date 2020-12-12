import React, { useState } from 'react';
import { getToken, getResult, getResponse } from '../../utils/api_requests';
import Falcone from '../Falcone/Falcone';
import './App.css';

function App(props) {
	const [planets, setPlanets] = useState('');
	const [vehicles, setVehicles] = useState('');
	const [resultJSON, setResultJSON] = useState('');
	
	React.useEffect(() => {
		const planetsRes = getResponse('planets'),
			  vehiclesRes = getResponse('vehicles');
			  
		planetsRes
			.then(json => {
				setPlanets(json);
				return json;
			})
			.catch(err => console.log(err))
		
		vehiclesRes
			.then(json => {
				setVehicles(json);
				return json;
			})
			.catch(err => console.log(err))
	}, []);
	
	const handleResult = (selectedPlanets, selectedVehicles) => {
		const reqBody = Object.create(null);	
		
		reqBody.planet_Names = selectedPlanets;
		reqBody.vehicle_Names = selectedVehicles;
		
		getToken()
			.then(json => {
				reqBody.token = json.token;
				result(reqBody);
			})
			.catch(err => console.log(err))
	}
	
	const result = (reqBody) => {
		getResult(reqBody)
			.then(json => setResultJSON(json))
			.catch(err => console.log(err))
	}
	
	const resetResultJSON = () => {
		setResultJSON('');
	}
		
	return (
		<div className="App">
			{ planets 
				&& vehicles
				&& <Falcone 
					planets={planets}
					vehicles={vehicles}
					handleResult={handleResult}
					resultJSON={resultJSON}
					resetResultJSON={resetResultJSON}
					history={props.history}
				/>
			}
		</div>
	)
}

export default App;

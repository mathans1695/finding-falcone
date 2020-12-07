import React, { useState, useEffect } from 'react';
import { getResponse } from '../utils/api_requests';
import Falcone from './Falcone';
import './../styles/App.css';

function App(props) {
	const [planets, setPlanets] = useState('');
	const [vehicles, setVehicles] = useState('');
	
	useEffect(() => {
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
		
	return (
		<div className="App">
			{ planets 
				&& vehicles
				&& <Falcone 
					planets={planets}
					vehicles={vehicles}
					history={props.history}
				/>
			}
		</div>
	)
}

export default App;

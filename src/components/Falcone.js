import React, { useEffect, useState } from 'react';
import { Route, Link } from 'react-router-dom';
import { getToken, getResult } from '../utils/api_requests';
import Message from './Message';
import '../styles/falcone.css';
import MissionPlan from './MissionPlan';
import Result from './Result';
import Navbar from './Navbar';
import Footer from './Footer';


function Falcone(props) {
	const [resultJSON, setResultJSON] = useState('');
	const [selectedPlanets, setSelectedPlanets] = useState(new Array(4));
	const [selectedVehicles, setSelectedVehicles] = useState(new Array(4));
	const [time, setTime] = useState([0, 0, 0, 0]);
	const [message, setMessage] = useState('');
	
	useEffect(() => {
		setTimeout(() => {
			setMessage('');
		}, 2000)
	}, [message]);
	
	// method will execute on click of find falcone button
	function handleClick() {
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
	
	// method runs after token received and set resultJSON state with result
	function result(reqBody) {
		getResult(reqBody)
			.then(json => setResultJSON(json))
			.catch(err => console.log(err))
	}
	
	function updateSelectedPlanets(index, value) {
		const selectedPlanetsCopy = Array.from(selectedPlanets);
		selectedPlanetsCopy.splice(index, 1, value);
		
		setSelectedPlanets(selectedPlanetsCopy);
	}
	
	function updateSelectedVehicles(index, value) {
		const selectedVehiclesCopy = Array.from(selectedVehicles);
		selectedVehiclesCopy.splice(index, 1, value);
		
		setSelectedVehicles(selectedVehiclesCopy);
	}
	
	function updateTime(index, value) {
		const timeCopy = Array.from(time);
		timeCopy.splice(index, 1, value);
		
		setTime(timeCopy);
	}
	
	// reset everything back to initial condition
	function reset(e) {
		const target = e.target;
		const regExp = /result/i;
		const match = regExp.test(window.location.href);
		
		if(match) {
			if(target.innerText === 'Reset' || target.innerText === '') {
				props.history.push('/');
			}
		} 
		
		setTime([]);
		setResultJSON('');
		
		if(target.innerText === 'Reset' || target.innerText === '') {
			setMessage('Reset successful')
		}
	}
	
	let count = 0;
	let enableFindFalcone = false;
			  
	for (let i=0; i<selectedVehicles.length; i++) {
		if(selectedVehicles[i]) {
			count += 1;
		}
	}
		
	count === 4 && (enableFindFalcone = true);
		
	return (
		<div className='Falcone'>
			<Navbar reset={reset}/>
			<Route exact path='/'>
				<main className='Falcone__main'>
					<MissionPlan 
						planets={props.planets} 
						vehicles={props.vehicles}
						updateSelectedPlanets={updateSelectedPlanets}
						updateSelectedVehicles={updateSelectedVehicles}
						updateTime={updateTime}
						time={time}
					/>
					{
						enableFindFalcone
						? <Link to='/result'>
							<button 
								onClick={handleClick} 
								className='Falcone__button'
							>
								Find Falcone
							</button>
						  </Link>
						: <button 
							disabled={true} 
							className='Falcone__button'
						>
							Find Falcone
						</button>
					}
				</main>
			</Route>
			<Route 
				exact 
				path='/result' 
				render={() => {
					return (
						<main className='Falcone__main'>
							<Result resultJSON={resultJSON} time={time} reset={reset} />
						</main>
					)
				}}
			/>
			<Footer />
			{
				message &&
				<Message msg={message} />
			}
		</div>
	)
}

export default Falcone;
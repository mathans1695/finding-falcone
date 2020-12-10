import React, { useEffect, useState } from 'react';
import { Route, Link } from 'react-router-dom';
import Message from '../Message/Message';
import MissionPlan from '../MissionPlan/MissionPlan';
import Result from '../Result/Result';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';
import './Falcone.css';

function Falcone(props) {
	const [selectedPlanets, setSelectedPlanets] = useState(new Array(4));
	const [selectedVehicles, setSelectedVehicles] = useState(new Array(4));
	const [time, setTime] = useState([0, 0, 0, 0]);
	const [message, setMessage] = useState('');
	
	useEffect(() => {
		setTimeout(() => {
			setMessage('');
		}, 2000)
	}, [message]);
	
	function handleClick() {
		props.handleResult(selectedPlanets, selectedVehicles)
	}
	
	function updateMessage(msg) {
		setMessage(msg);
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
		
		setSelectedPlanets(new Array(4));
		setSelectedVehicles(new Array(4));
		setTime([0,0,0,0])
		props.resetResultJSON();
		
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
	
	console.log(selectedPlanets);
	console.log(selectedVehicles);
	console.log(time);
		
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
						updateMessage={updateMessage}
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
							<Result resultJSON={props.resultJSON} time={time} reset={reset} />
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
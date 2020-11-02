import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Result.css';
import Navbar from './Navbar';
import Footer from './Footer';

class Result extends Component {
	render() {
		const {resultJSON, time, reset} = this.props;
		console.log(resultJSON);
		
		return (
			<div className='Result'>
				{resultJSON !== '' &&
				  resultJSON.status === 'success' ?
					<>
						<p className='Result__msg'>Success! Congratulations on Finding Falcone. King Shan is mighty pleased.</p>
						<p className='Result__time'>
							Time taken: {time.reduce((a, b) => {
								return a+b;
							}, 0)}
						</p>	
						<p className='Result__planet'>
							Planet found: {resultJSON.planet_name}
						</p>
						<Link to='/'>
							<button 
								className='Result__startAgain'
								onClick={reset}
							>
								Start Again
							</button>
						</Link>
					</>
					: <>
						<p className='Result__msg'>Mission Failed!. King Shan is mad at you.</p>
						<p className='Result__time'>
							Time taken: {time.reduce((a, b) => {
								return a+b;
							}, 0)}
						</p>
						<Link to='/'>
							<button 
								className='Result__startAgain'
								onClick={reset}
							>
								Start Again
							</button>
						</Link>
					  </>
				}
			</div>
		)
	}
}

export default Result;
import React from 'react';
import loading from '../Images/loading.gif';
import { Link } from 'react-router-dom';
import '../styles/Result.css';

function Result(props) {
	const {resultJSON, time, reset} = props;
	return (
		<div className='Result'>
			{resultJSON ?
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
			  : <img src={loading} alt='loading' />
			}
		</div>
	)
}

export default Result;
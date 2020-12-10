import React from 'react';
import './Navbar.css';

function Navbar(props) {	
	return (
		<div className='Navbar'>
			<div className='Navbar__logo'>
				<h1 className='Navbar__title'>Finding Falcone!</h1>
			</div>
			<div className='Navbar__menu'>
				<span 
					className='Navbar__reset'
					onClick={props.reset}
				>
					Reset
				</span>
				<a href='http://www.geektrust.in/' target='_blank' rel='noreferrer'>
					<span className='Navbar__geekhome'>
						Geek Trust Home
					</span>
				</a>
			</div>
		</div>
	)
}

export default Navbar;
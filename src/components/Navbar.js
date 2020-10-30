import React, { Component } from 'react';
import '../styles/Navbar.css';

class Navbar extends Component {
	render() {
		return (
			<div className='Navbar'>
				<div className='Navbar__logo'>
					<h1 className='Navbar__title'>Finding Falcone!</h1>
				</div>
				<div className='Navbar__menu'>
					<span className='Navbar__reset'>
						Reset
					</span>
					<span className='Navbar__results'>
						Results
					</span>
				</div>
			</div>
		)
	}
}

export default Navbar;
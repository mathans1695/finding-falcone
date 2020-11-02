import React, { Component } from 'react';
import '../styles/Navbar.css';

class Navbar extends Component {
	constructor(props) {
		super(props);
		this.handleReset = this.handleReset.bind(this);
	}
	
	handleReset(e) {
		this.props.reset();
	}
	
	render() {
		return (
			<div className='Navbar'>
				<div className='Navbar__logo'>
					<h1 className='Navbar__title'>Finding Falcone!</h1>
				</div>
				<div className='Navbar__menu'>
					<span 
						className='Navbar__reset'
						onClick={this.handleReset}
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
}

export default Navbar;
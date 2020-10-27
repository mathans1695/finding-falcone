import React, { Component } from 'react';
import '../styles/AssignRocket.css';

class AssignRocket extends Component {
	render() {
		const vehicles = this.props.vehicles;
		console.log(vehicles);
		
		const options = vehicles.map((vehicle) => {	
			const { name, total_no } = vehicle;
			let display = '';
			if (!vehicle.total_no) {
				display = (
					<div 
						key={Math.random()*1000} 
						className='AssignRocket__option AssignRocket__option--disable'
					>
						<input type='radio' value={name} id={name} disabled={true} />
						<label htmlFor={name}>{name} ({total_no})</label>
					</div>
				)
			}
			else
				display = (
					<div key={name} className='AssignRocket__option'>
						<input type='radio' value={name} id={name} />
						<label htmlFor={name}>{name} ({total_no})</label>
					</div>
				)
			return display;
		});
		
		return (
			<div className='AssignRocket'>
				{options}
			</div>
		)
	}
}

export default AssignRocket;
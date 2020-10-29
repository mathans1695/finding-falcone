import React, { Component } from 'react';
import { uuid } from '../helpers';
import '../styles/AssignRocket.css';

class AssignRocket extends Component {
	constructor(props) {
		super(props);
		this.state = {
			selectedOption: ''
		}
		this.handleOnValueChange = this.handleOnValueChange.bind(this);
	}
	
	handleOnValueChange(e) {
		const target = e.target,
			  rocket = target.value,
			  speed = target.getAttribute('data-speed'),
			  totalNumber = target.getAttribute('data-total_no'),
			  planetDistance = this.props.vehicles.planetDistance,
			  id = target.getAttribute('data-id');
		
		this.props.handleVehicleUpdation(id, rocket, speed, totalNumber, planetDistance);
		
		this.setState({selectedOption: e.target.value});
	}
	
	render() {
		const vehicles = this.props.vehicles;
		
		const options = vehicles.vehicles.map((vehicle) => {
			const { name, total_no, speed } = vehicle;
			let display = '';
			let key = uuid();
			if (!vehicle.total_no > 0 || !vehicle.isPossible) {
				display = (
					<div  
						className='AssignRocket__option AssignRocket__option--disable'
						key={key}
					>
						<input 
							type='radio'
							value={name} 
							id={key} 
							disabled={true}
							checked={this.state.selectedOption === name}
							onChange={this.handleOnValueChange}
							data-total_no={total_no}
							data-speed={speed}
							data-id={vehicles.id}
						/>
						<label htmlFor={key}>{name} ({total_no})</label>
					</div>
				)
			}
			else
				display = (
					<div className='AssignRocket__option' key={key} >
						<input 
							type='radio' 
							value={name} 
							id={key} 
							checked={this.state.selectedOption === name}
							onChange={this.handleOnValueChange}
							data-total_no={total_no}
							data-speed={speed}
							data-id={vehicles.id}
						/>
						<label htmlFor={key}>{name} ({total_no})</label>
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
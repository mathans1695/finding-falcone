import React, { Component } from 'react';

class AssignRocket extends Component {
	render() {
		const vehicles = this.props.vehicles;
		
		const options = vehicles.map((vehicle) => {	
			const { name, total_no } = vehicle;
			return (
				<div key={name}>
					<input type='radio' value={name} id={name} />
					<label htmlFor={name}>{name} ({total_no})</label>
				</div>
			)
		});
		
		return (
			<div className='AssignRocket'>
				<div className='AssignRocket__options'>
					{options}
				</div>
			</div>
		)
	}
}

export default AssignRocket;
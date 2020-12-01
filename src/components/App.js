import React, { Component } from 'react';
import { getResponse } from '../utils/api_requests';
import Falcone from './Falcone';
import './../styles/App.css';

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			planets: '',
			vehicles: ''
		}
	}
	
	componentDidMount() {
		const planetsRes = getResponse('planets'),
			  vehiclesRes = getResponse('vehicles');
			  
		planetsRes
			.then(json => {
				this.setState({planets : json});
				return json;
			})
			.catch(err => console.log(err))
		
		vehiclesRes
			.then(json => {
				this.setState({vehicles : json});
				return json;
			})
			.catch(err => console.log(err))
	}
	
	render() {
		const { planets, vehicles } = this.state;
		
		return (
			<div className="App">
				{ planets 
					&& vehicles
					&& <Falcone 
						planets={planets}
						vehicles={vehicles}
						history={this.props.history}
					/>
				}
			</div>
		);
	}
}

export default App;

import React, { Component } from 'react';
import Falcone from './components/Falcone';
import './App.css';

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			planets: '',
			vehicles: '',
		}
	}
	
	componentDidMount() {
		const planetsURL = "https://findfalcone.herokuapp.com/planets",
			  vehiclesURL = "https://findfalcone.herokuapp.com/vehicles",
			  planetsRes = fetch(planetsURL),
			  vehiclesRes = fetch(vehiclesURL);
			  
		planetsRes
			.then(res => res.json())
			.then(json => {
				this.setState({planets : json});
				return json;
			})
			.catch(err => console.log(err))
		
		vehiclesRes
			.then(res => res.json())
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
				{planets && vehicles
				 && <Falcone planets={planets} vehicles={vehicles} />
				}
			</div>
		);
	}
}

export default App;

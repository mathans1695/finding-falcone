import React, { Component } from 'react';
import Falcone from './components/Falcone';
import './App.css';

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			planets: '',
			vehicles: '',
			token: ''
		}
		this.getResult = this.getResult.bind(this);
	}
	
	componentDidMount() {
		const planetsURL = "https://findfalcone.herokuapp.com/planets",
			  vehiclesURL = "https://findfalcone.herokuapp.com/vehicles",
			  tokenURL = "https://findfalcone.herokuapp.com/token",
			  planetsRes = fetch(planetsURL),
			  vehiclesRes = fetch(vehiclesURL),
		      tokenRes = fetch(tokenURL, {
				  method: 'POST',
				  headers: {
					  'Accept': 'application/json'
				  }
			  });
			  
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
			
		tokenRes
			.then(res => res.json())
			.then(json => {
				this.setState({token : json.token});
				return json;
			})
			.catch(err => console.log(err))
	}
	
	getResult(reqBody) {
		const URL = 'https://findfalcone.herokuapp.com/find',
			  findRes = fetch(URL, {
				  method: 'POST',
				  headers: {
					  'Content-Type': 'application/json',
					  Accept: 'application/json'
				  },
				  body: JSON.stringify(reqBody)
			  });
		
		return findRes
				.then(res => res.json())
				.catch(err => console.log(err))
	}
	
	render() {
		const { planets, vehicles, token } = this.state;
		
		return (
			<div className="App">
				{ planets 
				  && vehicles
				  && <Falcone 
						planets={planets} 
						vehicles={vehicles} 
						token={token}
						getResult={this.getResult}
					 />
				}
			</div>
		);
	}
}

export default App;

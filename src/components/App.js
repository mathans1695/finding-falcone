import React, { Component } from 'react';
import fetch from 'node-fetch';
import Falcone from './Falcone';
import './../styles/App.css';

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			planets: '',
			vehicles: ''
		}
		this.getResult = this.getResult.bind(this);
		this.getToken = this.getToken.bind(this);
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
	
	getToken() {
		const tokenURL = "https://findfalcone.herokuapp.com/token",
		      tokenRes = fetch(tokenURL, {
				  method: 'POST',
				  headers: {
					  'Accept': 'application/json'
				  }
			  });
			  
		return tokenRes
				.then(res => res.json())
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
		const { planets, vehicles } = this.state;
		
		return (
			<div className="App">
				{ planets 
					&& vehicles
					&& <Falcone 
						planets={planets} 
						vehicles={vehicles} 
						getToken={this.getToken}
						getResult={this.getResult}
						history={this.props.history}
					/>
				}
			</div>
		);
	}
}

export default App;

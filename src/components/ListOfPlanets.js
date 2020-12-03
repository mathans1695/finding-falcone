import React, { Component } from 'react';
import ChoosePlanet from './ChoosePlanet';
import '../styles/ListOfPlanets.css';
import _ from 'lodash';

class ListOfPlanets extends Component {
	constructor(props) {
		super(props);
		this.state = {
			listOfPlanets: []
		}
		
		this.updateListOfPlanets = this.updateListOfPlanets.bind(this);
	}
	
	componentDidMount() {
		this.generateLists();
	}
	
	generateLists() {
		const ids = this.props.ids;
		const listOfPlanets = [];
		const planets = this.props.planets;
		
		for(let i=0; i<4; i++) {
			listOfPlanets[i] = {};
			listOfPlanets[i].planets = _.cloneDeep(planets);
			listOfPlanets[i].id = ids[i];
			listOfPlanets[i].previousSelected = [];
			listOfPlanets[i].curPlanet = 'Choose Planet';
		}
		
		this.setState({
			listOfPlanets: listOfPlanets
		});
	}
	
	updateListOfPlanets(id, removePlanet, planetDistance) {
		console.log(this.state);
		const listOfPlanets = _.cloneDeep(this.state.listOfPlanets);
		const selectedPlanets = Array.from(this.props.planet_names);
		const previousSelected = [];
		
		listOfPlanets.forEach((planets, index) => {
			if(id === planets.id) {
				planets['curPlanet'] = removePlanet;
				selectedPlanets.splice(index, 1, removePlanet);
				
				if(planets.previousSelected.length > 0) {
					previousSelected.push(planets.previousSelected[0]);
					
					// Updating previousSelected property of planets having the id
					planets.previousSelected = [];
					
					const temp = {};
					temp['name'] = removePlanet;
					temp['distance'] = planetDistance;
					planets.previousSelected.push(temp);
				} else {
					
					// Setting the previousSelected property of planets having this id
					const temp = {};
					temp['name'] = removePlanet;
					temp['distance'] = planetDistance;
					planets.previousSelected.push(temp);
				}
			}
		});
		
		
		// Updating other destinations planets
		listOfPlanets.forEach(planets => {
			if(id !== planets.id) {
				if(previousSelected.length > 0) {
					planets.planets.push(previousSelected[0]);
				}
				const temp = [];
				for (let i=0; i<planets.planets.length; i++) {
					if(planets.planets[i].name !== removePlanet) {
						temp.push(planets.planets[i]);
					}
				}
				planets.planets = temp;
			}
		})
		
		this.updatePlanetNames(selectedPlanets);
		
		this.setState({
			listOfPlanets: listOfPlanets,
		});
	}
	
	updatePlanetNames(planet_names) {
		this.props.updatePlanetNames(planet_names);
	}
	
	render() {
		const { listOfPlanets } = this.state;
		
		const choosePlanets = (
			listOfPlanets.map((vehiclesObj, index) => {
				return (
					<div className='ListOfPlanets__destination' key={index}>
						<ChoosePlanet 
							planets={listOfPlanets[index]}
							updatePlanet={this.updateListOfPlanets}
						/>
					</div>
				)
			})
		);
		
		return (
			<div className='ListOfPlanets'>
				{choosePlanets}
			</div>
		);
	}
}

export default ListOfPlanets;
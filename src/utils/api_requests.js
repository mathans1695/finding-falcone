const BASE_URL = "https://findfalcone.herokuapp.com/";

function getResponse(get) {
	const response = fetch(BASE_URL+get);
	return response
		.then(res => res.json())
		.then(json => {
			return json;
		})
		.catch(err => console.log(err))
}

function getToken() {
	const tokenRes = fetch(BASE_URL+'token', {
			method: 'POST',
			headers: {
				'Accept': 'application/json'
			}
		});
			  
	return tokenRes
		.then(res => res.json())
		.catch(err => console.log(err))
}

function getResult(reqBody) {
	const URL = 'https://findfalcone.herokuapp.com/find',
		  findRes = fetch(URL, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Accept': 'application/json'
			},
			body: JSON.stringify(reqBody)
		});
		
	return findRes
		.then(res => res.json())
		.catch(err => console.log(err))
}

export { getResponse, getToken, getResult, BASE_URL };
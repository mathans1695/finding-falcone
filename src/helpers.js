function uuid() {
	let firstPart = Math.floor(Math.random() * 1e6);
	let secondPart = Math.floor(Math.random() * 1e6);
	
	let uniqueID = String(firstPart + secondPart);
	if(uniqueID.length > 6) uniqueID = uniqueID.slice(0, -1);
	
	return uniqueID;
}

export { uuid };
export function setCurrentPosition(coords) {
	//console.log('setCurrentPosition: ', ...arguments);

	this.setState({
		loaded: true,
		region: {
			latitude: coords.latitude,
			longitude: coords.longitude,
			latitudeDelta: 0.01,
			longitudeDelta: 0.01
		}
	});
}

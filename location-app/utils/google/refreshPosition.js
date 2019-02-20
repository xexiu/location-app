const currentPositionOpts = {
	enableHighAccuracy: true,
	timeout: 10000,
	maximumAge: 0
};

export function refreshPosition() {
	navigator.geolocation.getCurrentPosition(pos => {
		this.map.animateToCoordinate({
			longitude: pos.coords.longitude,
			latitude: pos.coords.latitude
		}, 100);
	}, currentPositionOpts);
}

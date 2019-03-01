const currentPositionOpts = {
	enableHighAccuracy: true,
	timeout: 10000,
	maximumAge: 100000
};

export function getCurrentPosition(options = currentPositionOpts) {
	return new Promise(function(resolve, reject) {
		return navigator.geolocation.getCurrentPosition(resolve, reject, options);
	});
}

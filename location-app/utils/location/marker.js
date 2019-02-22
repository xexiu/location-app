import React from 'react';
import LocationMarker from '../../components/locations/LocationMarker';

export function buildMarker(markers) {
	return markers.map(marker => {
		const { location } = marker.geometry;
		const coords = {
			latitude: location.lat,
			longitude: location.lng
		};

		return (
			<LocationMarker
				marker={marker}
				coords={coords}
				key={(item, index) => index.toString()}
			/>
		);
	});
}

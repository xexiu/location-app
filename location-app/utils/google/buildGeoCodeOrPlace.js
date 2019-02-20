export function buildGeoCodeOrPlace(places, geoCodes) {
	const placesResults = places.results;
	const geoCodesResult = geoCodes && geoCodes.results[0];
	const geoCodeGlobalCode = geoCodes.plus_code && geoCodes.plus_code.global_code;

	for (let i = 0; i < placesResults.length; i++) {
		const placeResult = placesResults[i];
		const placePlusCode = placeResult && placeResult.plus_code;

		if (placePlusCode) {
			const placeGlobalCode = placePlusCode.global_code;

			if (placeGlobalCode === geoCodeGlobalCode) {
				return { place: placeResult };
			}
		}
	}

	return { geoCode: geoCodesResult };
}

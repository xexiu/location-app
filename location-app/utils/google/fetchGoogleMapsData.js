import { GOOGLE_MAPS_API } from '../../constants/Apis';

const ROOT_API = 'https://maps.googleapis.com/maps/api/';
const AUTOCOMPLETE_PLACE = `${ROOT_API}place/autocomplete/json?input=`;
const PLACE_SEARCH = `${ROOT_API}place/search/json?location=`;
const GEOCODE = `${ROOT_API}geocode/json?latlng=`;
const DETAILS_PLACE = `${ROOT_API}place/details/json?placeid=`;
const RADIUS = 'radius=10';
const FETCH_OPTIONS = {
	method: 'GET',
	headers: {
		'Access-Control-Allow-Origin': '*',
		'Access-Control-Allow-Credentials': true,
		'Access-Control-Allow-Methods': 'POST, GET'
	}
};

const GEO_PLACES = ['route', 'locality'];

const stPatricks = '41.487485,2.031297';
const castellNr1 = '41.492692697831885,2.026431038977603';
const montSeny = '41.759480,2.395221';

export function fecthAutoCompleteGoogleMaps(query) {
	const autocompleteApi = `${AUTOCOMPLETE_PLACE}${query}&key=${GOOGLE_MAPS_API}`;

	return fetch(autocompleteApi, FETCH_OPTIONS)
		.then(response => response.json());
}

export function fetchData(url, options = FETCH_OPTIONS) {
	return fetch(url, options)
		.then(response => response.json());
}

export async function fetchPlaceDetails(placeId) {
	return await fetchData(`${DETAILS_PLACE}${placeId}&key=${GOOGLE_MAPS_API}`);
}

export async function fetchPlaceOrGeoGoogleMaps(coords) {
	const placesApi = `${PLACE_SEARCH}${coords}&${RADIUS}&key=${GOOGLE_MAPS_API}`;
	const geoCodeApi = `${GEOCODE}${coords}&${RADIUS}&key=${GOOGLE_MAPS_API}`;

	const places = await fetchData(placesApi);
	const hasGeo = places.results.length >= 1 && GEO_PLACES.indexOf(places.results[0].types[0]) >= 0;

	if (places.status === 'ZERO_RESULTS' || hasGeo) { // maybe on the mountain when ZERO RESULTS
		const geo = await fetchData(geoCodeApi);
		// console.log('Geo', geo.results[0].place_id);

		return geo && await fetchPlaceDetails(`${geo.results[0].place_id}`);
	}

	//console.log('Places', places.results[1].place_id);
	return places && await fetchPlaceDetails(`${places.results[1].place_id}`);
}

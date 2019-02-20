import {
	getCurrentPosition,
	getGoogleMapsData,
	buildMapsObj
} from '.';
import { Permissions } from 'expo';
const stPatricks = '41.487485,2.031297';
const castellNr1 = '41.492571,2.026517';
const montSeny = '41.773690,2.438481';

function saveLocationFromGoogleToDb() {

}

export 	async function getPlacesOnBackgroundTask() {
	const { status } = await Permissions.askAsync(Permissions.LOCATION);

	if (status === 'granted') {
		const currentPosition = await getCurrentPosition();
		const { accuracy } = currentPosition.coords;

		console.log('Geo Position: ', currentPosition);

		if (currentPosition) {
			const { latitude, longitude } = currentPosition.coords;

			// accuracy >= 65 --> send notification to user
			// if YES --> fetchData and save to db --> fecthGoogleMapsData(`${latitude},${longitude}`);
			// if no --> don't do nothing
		}
	}
}

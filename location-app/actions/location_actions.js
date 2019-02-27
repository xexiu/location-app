import * as firebase from 'firebase';
import {
	LOCATION_UPDATED_NAME_SUCCESS,
	LOCATION_UPDATED_NAME_FAIL
} from '../constants/types';

export function updateItem(location, currentUser, locationName) {
	return function(dispatch) {
		return locationName.length >= 3
			?
			firebase.database().ref().child(`Users/${currentUser.uid}/locations/${location.key}`).update({
				name: locationName
			}, () => {
				dispatch({
					payload: locationName,
					type: LOCATION_UPDATED_NAME_SUCCESS
				});
			})
			:
			dispatch({
				payload: '',
				type: LOCATION_UPDATED_NAME_FAIL
			});
	};
}

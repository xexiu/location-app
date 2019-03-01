import {
	LOCATION_UPDATED_NAME_SUCCESS,
	LOCATION_UPDATED_NAME_FAIL
} from '../constants/types';

/* eslint-disable camelcase */

export default function(state = {}, action) {
	switch (action.type) {
		case LOCATION_UPDATED_NAME_SUCCESS:
			return { name: action.payload };
		case LOCATION_UPDATED_NAME_FAIL:
			return { name: action.payload };
		default:
			return state;
	}
}

import {
    FACEBOOK_LOGIN_SUCCESS,
    FACEBOOK_LOGIN_CANCELED
} from '../constants/facebook';

/* eslint-disable camelcase */

export default function(state = {}, action) {
	switch (action.type) {
		case FACEBOOK_LOGIN_SUCCESS:
			return { fbLogin: action.payload };
		case FACEBOOK_LOGIN_CANCELED:
			return { fbLogin: null };
		default:
			return state;
	}
}

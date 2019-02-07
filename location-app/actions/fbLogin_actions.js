import { Facebook } from 'expo';
import {
	FACEBOOK_LOGIN_SUCCESS,
	FACEBOOK_APP_ID,
	FACEBOOK_LOGIN_CANCELED
} from '../constants/facebook';
import * as firebase from 'firebase';
import { dispatcher, signInUser, fetchAsync } from '../utils';

/* eslint-disable no-console */

function createUser(fbData) {
	const email = `fbLogin_email_${fbData.id}@me.com`;
	const password = `fb_password_${fbData.id}`;

	firebase.auth().createUserWithEmailAndPassword(email, password).then(auth => {
		firebase.database().ref('users/' + auth.user.uid).set({
			name: fbData.name,
			email: email,
			password
		});
	}).catch(err => {
		signInUser(email, password);

		console.log('Error facebook login: ', err);
	});
}

async function startFacebookLogin(dispatch) {
	const { type, token } = await Facebook.logInWithReadPermissionsAsync(FACEBOOK_APP_ID, {
		permissions: ['public_profile']
	});

	if (type === 'cancel') {
		return dispatch(dispatcher(FACEBOOK_LOGIN_CANCELED, 'fb_cancel'));
	} else if (type === 'success') {
		fetchAsync(`https://graph.facebook.com/me?access_token=${token}`)
			.then(fbData => {
				createUser(fbData);

				return dispatch(dispatcher(FACEBOOK_LOGIN_SUCCESS, 'fb_success'));
			});
	}

	return null;
}

export function facebookLogin() {
	return async function(dispatch) {
		startFacebookLogin(dispatch);
	};
}

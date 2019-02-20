import { Facebook } from 'expo';
import {
	FACEBOOK_APP_ID
} from '../constants/facebook';
import * as firebase from 'firebase';
import { signInUser } from '../utils/user';
import { fetchAsync } from '../utils/common';

/* eslint-disable no-console */

function createUser(data) {
	const email = `fbLogin_email_${data.id}@me.com`;
	const password = `fb_password_${data.id}`;

	firebase.auth().createUserWithEmailAndPassword(email, password).then(auth => {
		firebase.database().ref(`Users/${auth.user.uid}`).set({
			name: data.name,
			email: email,
			password
		});
	}).catch(err => {
		signInUser(email, password);

		console.log('Error facebook login: ', err);
	});
}

async function startFacebookLogin() {
	const { type, token } = await Facebook.logInWithReadPermissionsAsync(FACEBOOK_APP_ID, {
		permissions: ['public_profile']
	});

	if (type === 'cancel') {
		return console.log('Error facebook type: ', type);
	} else if (type === 'success') {
		fetchAsync(`https://graph.facebook.com/me?access_token=${token}`)
			.then(data => {
				return createUser(data);
			});
	}

	return null;
}

export async function facebookLogin() {
	await startFacebookLogin();
}

import * as firebase from 'firebase';
/* eslint-disable no-console */

export function dispatcher(type, payload = null) {
	return {
		type: type,
		payload: payload
	};
}

export function signInUser(email, password) {
	firebase.auth().signInWithEmailAndPassword(email, password)
		.then(() => {
			console.log('User successfully authenticated!');
		})
		.catch(err => {
			console.log('Error on auth: ', err);
		});
}

export async function fetchAsync(apiUrl) {
	const response = await fetch(apiUrl);
	const json = await response.json();

	return json;
}

import * as firebase from 'firebase';
/* eslint-disable no-console */

export function signInUser(email, password) {
	firebase.auth().signInWithEmailAndPassword(email, password)
		.then(() => {
			console.log('User successfully authenticated!');
		})
		.catch(err => {
			console.log('Error on auth user: ', err);
		});
}

export async function fetchAsync(apiUrl) {
	const response = await fetch(apiUrl);
	const json = await response.json();

	return json;
}

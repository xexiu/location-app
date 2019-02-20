import * as firebase from 'firebase';
/* eslint-disable no-console */

export function getUserName(currentUser) {
	const user = currentUser ? currentUser : firebase.auth();
	const userNameRef = firebase.database().ref(`Users/${user.uid}`);

	userNameRef.on('value', attrs => {
		this.setState({
			userName: attrs.child('name').val(),
			loaded: true
		});
	});
}

export function signInUser(email, password) {
	firebase.auth().signInWithEmailAndPassword(email, password)
		.then(() => {
			console.log('User successfully authenticated!');
		})
		.catch(err => {
			console.log('Error on auth user: ', err);
		});
}

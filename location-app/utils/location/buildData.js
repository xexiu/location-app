import * as firebase from 'firebase';

export function buildData(currentUser, location, entryName) {
	const _currentUser = currentUser ? currentUser : firebase.auth().user;
	const data = {};

	data[`Users/${_currentUser.uid}/${entryName}/${location.key}`] = location;

	return data;
}

import React, { Component } from 'react';
import { View, Text } from 'react-native';
import * as firebase from 'firebase';
import PreLoader from '../../components/PreLoader';

export default class WelcomeGuestScreen extends Component {
	constructor() {
		super();

		this.state = {
			userName: '',
			loaded: false
		};
	}

	componentDidMount() {
		const { currentUser } = firebase.auth(); // user authenticated --> facebook login or email/pass

		if (currentUser) {
			const userNameRef = firebase.database().ref(`users/${currentUser.uid}`);

			userNameRef.on('value', attrs => {
				this.setState({
					userName: attrs.child('name').val(),
					loaded: true
				});
			});
		}
	}
	render() {
		const { userName, loaded } = this.state;

		if (!loaded) {
			return (<PreLoader />);
		}


		return (
			<View>
				<Text>Welcome {userName}!</Text>
			</View>
		);
	}
}

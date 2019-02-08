import React, { Component } from 'react';
import { View, Text } from 'react-native';
import * as firebase from 'firebase';
import PreLoader from '../../components/PreLoader';

/* eslint-disable no-console */

export default class LandingUserScreen extends Component {
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
		/* @TODO
			- should we show the userName somewhere?
		*/

		if (!loaded) {
			return (<PreLoader />);
		}


		return (
			<View>
				<Text>Locations!</Text>
				<Text>Locations!</Text>
				<Text>Locations!</Text>
			</View>
		);
	}
}

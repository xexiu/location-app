import React, { Component } from 'react';
import { View } from 'react-native';
import * as firebase from 'firebase';
import Toast from 'react-native-easy-toast';

export default class LogoutUserScreen extends Component {
	constructor() {
		super();

		this.refToast = React.createRef();
	}
	componentDidMount() {
		firebase.auth().signOut().then(() => {
			this.refToast.current.show('Logout successfully!', 1000);
		}).catch(error => {
			this.refToast.current.show(`Error Unknown!${error}`, 1000);
		});
	}

	render() {
		return (
			<View>
				<Toast ref={this.refToast} />
			</View>
		);
	}
}

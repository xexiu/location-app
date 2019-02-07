import React, { Component } from 'react';
import { Provider } from 'react-redux';
import store from './location-app/store';
import PreLoader from './location-app/components/PreLoader';
import * as firebase from 'firebase';
import { firebaseConfig } from './location-app/constants/firebase';
import MainGuestScreen from './location-app/screens/guests/MainGuestScreen';
import MainUserScreen from './location-app/screens/users/MainUserScreen';
import Toast, { DURATION } from 'react-native-easy-toast';

firebase.initializeApp(firebaseConfig);

export class App extends Component {
	constructor() {
		super();

		this.refToast = React.createRef();

		this.state = {
			isLogged: false,
			loaded: false
		};
	}

	async componentDidMount() {
		// For Testing NOT logged
		firebase.auth().signOut();

		await firebase.auth().onAuthStateChanged(user => {
			if (user) {
				this.setState({
					isLogged: true,
					loaded: true
				});

				this.refToast.current.show('Successfully Authenticated!', DURATION.LENGTH_LONG);
			} else {
				this.setState({
					isLogged: false,
					loaded: true
				});
			}
		});
	}


	render() {
		const { isLogged, loaded } = this.state;

		if (!loaded) {
			return (<PreLoader />);
		} else if (isLogged) {
			return (
				<Provider store={store}>
					<Toast ref={this.refToast} />
					<MainUserScreen />
				</Provider>
			);
		}

		return (
			<Provider store={store}>
				<MainGuestScreen />
			</Provider>
		);
	}
}

export default App;

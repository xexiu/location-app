import React, { Component } from 'react';
import { View } from 'react-native';
import * as firebase from 'firebase';
import { PreLoader } from '../../components/common';
import LocationList from '../../components/locations/LocationList';
import PropTypes from 'prop-types';
import LocationEmpty from '../../components/locations/LocationEmpty';
import LocationListItem from '../../components/locations/LocationListItem';
import { NavigationActions } from 'react-navigation';
import { isEmpty } from '../../utils/common';

/* eslint-disable no-console, class-methods-use-this */

export default class LandingUserScreen extends Component {
	constructor(props) {
		super(props);
		const { currentUser } = firebase.auth();

		this._isMounted = false;
		this.refLocations = firebase.database().ref().child(`Users/${currentUser.uid}/locations`);
		this.state = {
			location: null,
			userName: '',
			loaded: false
		};
	}

	goToLocationDetailOnMap(location) {
		const navigateAction = NavigationActions.navigate({
			routeName: 'DetailLocationScreen',
			params: location
		});

		this.props.navigation.dispatch(navigateAction);
	}

	renderItem(location) {
		return (
			<LocationListItem
				title={location.name}
				action={() => this.goToLocationDetailOnMap(location)}
			/>
		);
	}

	loadLocationsFromDb() {
		this.refLocations.on('value', snapshot => {
			const location = [];

			snapshot.forEach(s => {
				const locationDetails = snapshot.child(s.key).val();

				location.push(locationDetails);
			});

			this.setState({
				location: location,
				loaded: true
			});
		});
	}

	componentWillUnmount() {
		this._isMounted = false;
	}

	async componentDidMount() {
		this._isMounted = true;

		this._isMounted && this.loadLocationsFromDb();
	}

	render() {
		const {
			loaded,
			location
		} = this.state;

		if (!loaded) {
			return (<PreLoader />);
		}

		if (isEmpty(location)) {
			return (<LocationEmpty />);
		}

		return (
			<View style={{ flex: 1 }}>
				<LocationList
					itemsList={location}
					action={(item) => this.renderItem(item)}
				/>
			</View>
		);
	}
}

LandingUserScreen.propTypes = {
	locations: PropTypes.array,
	navigation: PropTypes.object
};

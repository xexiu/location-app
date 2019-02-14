import React, { Component } from 'react';
import { View, Text, Dimensions, ScrollView } from 'react-native';
import { Icon } from 'react-native-elements';
import * as firebase from 'firebase';
import { PreLoader } from '../../components/common';
import { Permissions } from 'expo';
import LocationList from '../../components/locations/LocationList';
import PropTypes from 'prop-types';

/* eslint-disable no-console, class-methods-use-this, max-nested-callbacks, max-len */
const API_KEY = 'AIzaSyDWmmFkUfuDtHmHHiXiL7Fk7SmRMLJMf9g';
const ROOT_API = 'https://maps.googleapis.com/maps/api/';
const fetchOptions = { method: 'GET',
	headers: {
		'Access-Control-Allow-Origin': '*',
		'Access-Control-Allow-Credentials': true,
		'Access-Control-Allow-Methods': 'POST, GET'
	}
};

const currentPositionOpts = {
	enableHighAccuracy: true,
	timeout: 10000,
	maximumAge: 0
};

const stPatricks = '41.487485,2.031272';
const teleferic = '41.4710238,2.0895839';
const castell = '41.492801,2.026301';

export default class LandingUserScreen extends Component {
	constructor() {
		super();
		const windowWidth = Dimensions.get('window').width;
		const windowHeight = Dimensions.get('window').height;

		this._isMounted = false;
		this.state = {
			locations: [],
			userName: '',
			loaded: false
		};
	}

	getUserName(currentUser) {
		const userNameRef = firebase.database().ref(`users/${currentUser.uid}`);

		userNameRef.on('value', attrs => {
			this.setState({
				userName: attrs.child('name').val(),
				loaded: true
			});
		});
	}

	getObjectFromMaps(places, geoCodes) {
		const placesResults = places.results;
		const geoCodesResult = geoCodes && geoCodes.results[0];
		const geoCodeGlobalCode = geoCodes.plus_code && geoCodes.plus_code.global_code;

		for (let i = 0; i < placesResults.length; i++) {
			const placeResult = placesResults[i];
			const placePlusCode = placeResult && placeResult.plus_code;

			if (placePlusCode) {
				const placeGlobalCode = placePlusCode.global_code;

				if (placeGlobalCode === geoCodeGlobalCode) {
					return { place: placeResult };
				}
			}
		}

		return { geoCode: geoCodesResult };
	}

	saveLocationsFromGoogleToDb() {

	}

	async getLocationsFromDb(userNameRef) {
		return new Promise((resolve, reject) => {
			userNameRef.on('value', snapshot => {
				const locations = [];

				snapshot.forEach(row => {
					const geoCodeObj = row.val().geoCode;
					const placesObj = row.val().place;

					if (!!geoCodeObj || !!placesObj) {
						locations.push({ place: placesObj }, { geoCode: geoCodeObj });
					}

					return resolve(locations);
				});
			});
		});
	}

	getGoogleMapsData() {
		const placesApi = `${ROOT_API}place/search/json?location=${stPatricks}&radius=20&key=${API_KEY}`;
		const geoCodeApi = `${ROOT_API}geocode/json?latlng=${stPatricks}&radius=20&key=${API_KEY}`;
		const urlsApi = [placesApi, geoCodeApi];

		return Promise.all(urlsApi.map(urlApi => fetch(urlApi, fetchOptions))).then(responses =>
			Promise.all(responses.map(res => res.json()))
		);
	}

	componentWillUnmount() {
		this._isMounted = false;
	}

	getDate() {
		const dateObj = new Date();
		const month = dateObj.getUTCMonth() + 1; //months from 1-12
		const day = dateObj.getUTCDate();
		const year = dateObj.getUTCFullYear();

		return String(`${year}/${month}/${day}`);
	}

	async getPlacesOnBackgroundTask() {
		const { status } = await Permissions.askAsync(Permissions.LOCATION);

		if (status === 'granted') {
			const position = this.getCurrentPosition(currentPositionOpts);

			console.log('Geo Position: ', position);

			if (position) {
				const { latitude, longitude } = position.coords;

				this._isMounted && this.setState({
					region: {
						latitude: latitude,
						longitude: longitude,
						latitudeDelta: 0.1,
						longitudeDelta: 0.1
					}
				});

				const maps = await this.getGoogleMapsData();

				if (maps) {
					const googleMapObj = this.getObjectFromMaps(maps[0], maps[1]);
					const placeIdFromGeoCodes = googleMapObj && googleMapObj.geoCode && googleMapObj.geoCode.place_id;
					const placeIdFromPlaces = googleMapObj && googleMapObj.place && googleMapObj.place.place_id;
					const date = this.getDate();
					const mapObj = Object.assign({ date: date }, googleMapObj);

					//firebase.database().ref('users/' + currentUser.uid).push(mapObj);
				}
			}
		}
	}

	getCurrentPosition(options) {
		return new Promise(function(resolve, reject) {
			return navigator.geolocation.getCurrentPosition(resolve, reject, options);
		});
	}

	async componentDidMount() {
		this._isMounted = true;
		const { currentUser } = firebase.auth();
		const userUID = 'SQUMtNbZV5ME6cduz8yBxEnLf392'; // for testing only

		if (userUID) {
			// this.getUserName(currentUser);
			const userNameRef = firebase.database().ref(`users/${userUID}`);
			const locations = await this.getLocationsFromDb(userNameRef);

			this.setState({
				locations,
				loaded: !!locations.length
			});
		}
	}

	onRegionChange(region) {
		console.log('onRegionChange: ', region);
		//this.setState({ region });
	}

	render() {
		const { userName, loaded, locations } = this.state;
		/* @TODO
			- should we show the userName somewhere?
		*/

		if (!loaded) {
			return (<PreLoader />);
		}


		return (
			<ScrollView>
				<LocationList locations={locations} navigation={this.props.navigation} />
			</ScrollView>
		);
	}
}

LandingUserScreen.propTypes = {
	locations: PropTypes.array,
	navigation: PropTypes.object
};

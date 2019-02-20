import React, { Component } from 'react';
import { View, ScrollView } from 'react-native';
import { PreLoader, AppButton } from '../../components/common';
import { MapView, Permissions } from 'expo';
import { Icon, SearchBar } from 'react-native-elements';
import PropTypes from 'prop-types';
import TouchableScale from 'react-native-touchable-scale';
import * as firebase from 'firebase';
import {
	getCurrentPosition,
	fetchPlaceDetails,
	refreshPosition,
	fetchPlaceOrGeoGoogleMaps,
	fecthAutoCompleteGoogleMaps
} from '../../utils/google';
import { buttonsStyle } from '../../styles/buttonsStyle';
import { resetStateAndCloseKeyboard } from '../../utils/common';
import { NavigationActions } from 'react-navigation';
import LocationList from '../../components/locations/LocationList';
import LocationListItem from '../../components/locations/LocationListItem';
import LocationMarker from '../../components/locations/LocationMarker';
import Toast from 'react-native-easy-toast';

/* eslint-disable no-console, class-methods-use-this, max-nested-callbacks, max-len, camelcase, complexity */

export default class SaveCurrentLocationScreen extends Component {
	static navigationOptions = {
		header: null
	}
	constructor(props) {
		super(props);

		this.user = this.props.navigation.state.params.user;
		this.refToast = React.createRef();

		this._isMounted = false;
		this.state = {
			locationResultFromSearch: [],
			textInput: '',
			location: null,
			map: null,
			user: this.user,
			ready: true,
			markers: [],
			loaded: false,
			errorMessage: '',
			region: {
				longitude: 41.38270290,
				latitude: 2.1427772,
				longitudeDelta: 0.01,
				latitudeDelta: 0.01
			}
		};
	}

	componentWillUnmount() {
		this._isMounted = false;
	}

	async componentDidMount() {
		const { status } = await Permissions.askAsync(Permissions.LOCATION);

		if (status!=='granted') {
			this.setState({ errorMessage: 'Permissions not granted.' });
		} else {
			try {
				const currentPosition = await getCurrentPosition();

				if (currentPosition) {
					const { coords } = currentPosition;
					const locationDetails = await fetchPlaceOrGeoGoogleMaps(`${coords.latitude},${coords.longitude}`);

					this.setState({
						location: [locationDetails && locationDetails.result],
						region: {
							latitude: coords.latitude,
							longitude: coords.longitude,
							latitudeDelta: 0.01,
							longitudeDelta: 0.01
						},
						loaded: true
					});
				}
			} catch (error) {
				this.setState({ errorMessage: error.message });
			}
		}
	}

	hasDuplicatedLocationsDb(refLocations, location) {
		const placesIds = [];
		const currentPlaceId = location[0].place_id;

		refLocations.on('value', snapshot => {
			const locations = [];

			snapshot.forEach(s => {
				const locationDetails = snapshot.child(s.key).val();

				locations.push(locationDetails);
			});

			for (let i = 0; i < locations.length; i++) {
				const _location = locations[i];
				const placeId = _location.place_id;

				placesIds.push(placeId);
			}
		});

		if (placesIds.indexOf(currentPlaceId) >= 0) {
			return true;
		}

		return false;
	}

	onMapReady = (e) => {
		if (!this.state.ready) {
			this.setState({ ready: true });
		}
	};

	addDataToDb(currentUser, location, key) {
		this.setState({ errorMessage: '' });

		const data = {};

		data[`Users/${currentUser.uid}/locations/${key}`] = location[0];

		return firebase.database().ref().update(data).then(() => {
			const navigateAction = NavigationActions.navigate({
				routeName: 'LandingUserScreen'
			});

			this.refToast.current.show('Location correctly saved!', 1000, () =>{
				this.props.navigation.dispatch(navigateAction);
			});

		});
	}

	saveLocationFromGoogleToDb() {
		const { location, user } = this.state;
		const { currentUser } = user;
		const refLocations = firebase.database().ref().child(`Users/${currentUser.uid}/locations`);
		const key = refLocations.push().key;
		const placesIdDuplicated = this.hasDuplicatedLocationsDb(refLocations, location);

		if (placesIdDuplicated) {
			this.setState({ errorMessage: 'Duplicated location!' });

			return this.refToast.current.show('Duplicated location!', 1000);
		}

		return this.addDataToDb(currentUser, location, key);
	}

	async onPressLocation(evt) {
		const { latitude, longitude } = evt.nativeEvent.coordinate;
		const coords = `${latitude},${longitude}`;
		const locationDetails = await fetchPlaceOrGeoGoogleMaps(coords);

		resetStateAndCloseKeyboard.call(this, { textInput: '', locationResultFromSearch: [] });

		if (locationDetails) {
			this.setState({ location: [locationDetails.result] });
			this.setStateMarkerAndRegion(locationDetails);
		}
	}

	async searchBarGoogleMaps(query) {
		this.setState({ textInput: query });

		if (query.length > 2) {

			const location = await fecthAutoCompleteGoogleMaps(`${query.replace(/[\s]/g, '+')}`);

			this.setState({ locationResultFromSearch: location.predictions });
		}
	}

	setStateMarkerAndRegion(locationDetails, animate = false) {
		const locationResult = locationDetails.result;
		const { geometry } = locationResult;

		this.setState({
			markers: [locationResult],
			region: {
				latitude: geometry.location.lat,
				longitude: geometry.location.lng,
				longitudeDelta: 0.01,
				latitudeDelta: 0.01
			}
		});

		animate && this.map.animateToCoordinate({
			latitude: geometry.location.lat,
			longitude: geometry.location.lng
		}, 100);
	}

	async goToLocationOnMap(location) {
		resetStateAndCloseKeyboard.call(this, { textInput: '', locationResultFromSearch: [] });
		const locationDetails = await fetchPlaceDetails(location.place_id);


		if (locationDetails) {
			this.setState({ location: [locationDetails.result] });
			this.setStateMarkerAndRegion(locationDetails, true);
		}
	}

	renderItem(location) {
		return (
			<LocationListItem
				title={location.description}
				rightIcon={{}}
				action={() => this.goToLocationOnMap(location)}
			/>
		);
	}

	buildMarker(markers) {
		return markers.map(marker => {
			const { location } = marker.geometry;
			const coords = {
				latitude: location.lat,
				longitude: location.lng
			};

			return (
				<LocationMarker
					marker={marker}
					coords={coords}
					actionOnDragEnd={this.onPressLocation.bind(this)}
					key={(item, index) => index.toString()}
				/>
			);
		});
	}

	render() {
		const {
			loaded,
			textInput,
			locationResultFromSearch,
			region,
			markers,
			errorMessage
		} = this.state;

		if (!loaded) {
			return <PreLoader />;
		}

		return (
			<View style={{ flex: 1 }}>
				<View style={{ marginTop: 40 }}>
					<SearchBar
						showLoading={textInput.length > 2}
						placeholder="Search a location..."
						onChangeText={this.searchBarGoogleMaps.bind(this)}
						onClear={() => resetStateAndCloseKeyboard.call(this, { textInput: '', locationResultFromSearch: [] })}
						value={textInput}
					/>
					<LocationList
						itemsList={locationResultFromSearch}
						action={this.renderItem.bind(this)}
						hasFooter={false}
					/>
				</View>
				<MapView
					initialRegion={region}
					ref={ref => { this.map = ref; }}
					style={{ flex: 1 }}
					mapType="standard"
					zoomEnabled
					pitchEnabled
					followsUserLocation={false}
					showsUserLocation
					showsCompass
					showsBuildings
					showsTraffic
					showsIndoors
					loadingEnabled={true}
					onPress={this.onPressLocation.bind(this)}
					onMarkerPress={() => { console.log('Pin pressed'); }}
					onMapReady={this.onMapReady}
				>
					{this.buildMarker(markers)}
				</MapView>
				<View style={buttonsStyle.saveLocationFooterBtns}>
					<AppButton
						btnIcon={(<Icon
							Component={TouchableScale}
							raised
							name='arrow-left'
							type='font-awesome'
							color='#f50'
							onPress={() => this.props.navigation.goBack()}
						/>)}
						btnTitle=""
					/>
					<AppButton
						btnIcon={(<Icon
							Component={TouchableScale}
							raised
							name='save'
							type='font-awesome'
							color='#f50'
							onPress={this.saveLocationFromGoogleToDb.bind(this)}
						/>)}
						btnTitle=""
					/>
					<AppButton
						btnIcon={(<Icon
							Component={TouchableScale}
							raised
							name='refresh'
							type='font-awesome'
							color='#f50'
							onPress={refreshPosition.bind(this)}
						/>)}
						btnTitle=""
					/>
				</View>
				<Toast
					textStyle={{ fontWeight: 'bold', color: 'white' }}
					style={!!errorMessage && { backgroundColor: 'red' }}
					ref={this.refToast}
				/>
			</View>
		);
	}
}

SaveCurrentLocationScreen.propTypes = {
	navigation: PropTypes.object
};

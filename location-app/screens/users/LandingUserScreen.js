import React, { Component } from 'react';
import { View, Text, NetInfo } from 'react-native';
import { Permissions } from 'expo';
import { Icon } from 'react-native-elements';
import TouchableScale from 'react-native-touchable-scale';
import * as firebase from 'firebase';
import { PreLoader, OfflineNotice } from '../../components/common';
import LocationList from '../../components/locations/LocationList';
import LocationListItem from '../../components/locations/LocationListItem';
import PropTypes from 'prop-types';
import LocationEmpty from '../../components/locations/LocationEmpty';
import { isEmpty } from '../../utils/common';
import {
	loadDataFromDb,
	goToLocationDetail,
	locationEnabler,
	buildData
} from '../../utils/location';
import { typesIconsMap } from '../../constants/iconTypes';
import Toast from 'react-native-easy-toast';

/* eslint-disable no-console, class-methods-use-this */

const styles = {
	itemSubTitle: {
		fontSize: 12,
		fontStyle: 'italic',
		color: '#bbb',
		fontWeight: 'bold',
		textTransform: 'capitalize'
	}
};

export default class LandingUserScreen extends Component {
	constructor(props) {
		super(props);

		this.user = firebase.auth();
		this.currentUser = this.user.currentUser;
		this.refToast = React.createRef();
		this._isMounted = false;
		this.refLocations = firebase.database().ref().child(`Users/${this.currentUser.uid}/locations`);
		this.state = {
			isConnected: true,
			locations: [],
			userName: '',
			loaded: false,
			errorMessage: ''
		};
	}

	handleConnectivityChange(isConnected) {
		if (isConnected) {
			return this.setState({ isConnected });
		}

		return this.setState({ isConnected });
	}

	renderItem(location) {
		const leftIcon = (location && location.types && location.types[0]) || '';

		return (
			<LocationListItem
				withBadgeIcon={{
					value: (<Icon
						Component={TouchableScale}
						size={30}
						name='heart-o'
						type='font-awesome'
						color='red'
						onPress={this.addToFavoritesLocation.bind(this, location)}
					/>),
					badgeStyle: { backgroundColor: 'transparent', height: 30 }
				}}
				title={location.name}
				subtitle={location.formatted_address}
				subtitleStyle={styles.itemSubTitle}
				leftIcon={{ name: typesIconsMap[leftIcon] }}
				action={goToLocationDetail.bind(this, location)}
			/>
		);
	}

	componentWillUnmount() {
		this._isMounted = false;
		NetInfo.isConnected
			.removeEventListener('connectionChange', this.handleConnectivityChange.bind(this));
	}

	async componentDidMount() {
		const params = this.props.navigation.state.params;
		const errorLocation = String(Object.values(params)).indexOf('Error') >= 0;

		NetInfo.isConnected
			.addEventListener('connectionChange', this.handleConnectivityChange.bind(this));

		if (errorLocation) {
			locationEnabler.call(this);
		} else {
			const { status } = await Permissions.askAsync(Permissions.LOCATION);

			if (status === 'granted') {
				this._isMounted = true;

				this._isMounted && loadDataFromDb.call(this, this.refLocations, this.state, 'locations');
			} else {
				this.setState({ errorMessage: 'We found an error with permissons.' });
			}
		}
	}

	addToFavoritesLocation(location) {
		location.isFavorite = true;

		const data = buildData(this.currentUser, location, 'favorites');

		firebase.database().ref().update(data)
			.then(() => {
				firebase.database().ref().child(`Users/${this.currentUser.uid}/locations/${location.key}`).remove()
					.then(() => {
						this.refToast.current.show('Location marked as favorite.', 1000);
					});
			});

	}

	render() {
		const {
			loaded,
			locations,
			errorMessage,
			isConnected
		} = this.state;

		if (!isConnected) {
			return (<OfflineNotice />);
		}



		if (!!errorMessage) {
			return (
				<View>
					<Text>Error: {errorMessage}</Text>
				</View>
			);
		}

		if (!loaded) {
			return (<PreLoader />);
		}

		if (isEmpty(locations)) {
			return (
				<View>
					<LocationEmpty />
					<Toast
						position='top'
						ref={this.refToast}
					/>
				</View>);
		}

		return (
			<View style={{ flex: 1 }}>
				<LocationList
					itemsList={locations}
					action={(location) => this.renderItem(location)}
				/>
				<Toast
					position='top'
					ref={this.refToast}
				/>
			</View>
		);
	}
}

LandingUserScreen.propTypes = {
	locations: PropTypes.array,
	navigation: PropTypes.object
};

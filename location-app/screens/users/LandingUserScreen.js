import React, { Component } from 'react';
import { View } from 'react-native';
import { Icon } from 'react-native-elements';
import TouchableScale from 'react-native-touchable-scale';
import * as firebase from 'firebase';
import { PreLoader } from '../../components/common';
import LocationList from '../../components/locations/LocationList';
import LocationListItem from '../../components/locations/LocationListItem';
import PropTypes from 'prop-types';
import LocationEmpty from '../../components/locations/LocationEmpty';
import { isEmpty } from '../../utils/common';
import { loadDataFromDb, goToLocationDetail } from '../../utils/location';
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
		const { currentUser } = firebase.auth();

		this.refToast = React.createRef();
		this._isMounted = false;
		this.refLocations = firebase.database().ref().child(`Users/${currentUser.uid}/locations`);
		this.state = {
			locations: [],
			userName: '',
			loaded: false
		};
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
	}

	componentDidMount() {
		this._isMounted = true;

		this._isMounted && loadDataFromDb.call(this, this.refLocations, this.state, 'locations');
	}

	addToFavoritesLocation(location) {
		const user = firebase.auth();
		const { currentUser } = user;

		const data = {};

		location.isFavorite = true;

		data[`Users/${currentUser.uid}/favorites/${location.key}`] = location;

		firebase.database().ref().update(data)
			.then(() => {
				firebase.database().ref().child(`Users/${currentUser.uid}/locations/${location.key}`).remove()
					.then(() => {
						this.refToast.current.show('Location marked as favorite.', 1000);
					});
			});

	}

	render() {
		const {
			loaded,
			locations
		} = this.state;

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

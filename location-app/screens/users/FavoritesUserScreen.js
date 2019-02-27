import React, { Component } from 'react';
import * as firebase from 'firebase';
import { View } from 'react-native';
import { loadDataFromDb, goToLocationDetail } from '../../utils/location';
import { isEmpty } from '../../utils/common';
import { PreLoader } from '../../components/common';
import LocationEmpty from '../../components/locations/LocationEmpty';
import Toast from 'react-native-easy-toast';
import LocationList from '../../components/locations/LocationList';
import LocationListItem from '../../components/locations/LocationListItem';
import { Icon } from 'react-native-elements';
import TouchableScale from 'react-native-touchable-scale';
import { typesIconsMap } from '../../constants/iconTypes';

/* eslint-disable class-methods-use-this, no-console */

const styles = {
	itemSubTitle: {
		fontSize: 12,
		fontStyle: 'italic',
		color: '#bbb',
		fontWeight: 'bold',
		textTransform: 'capitalize'
	}
};

export default class FavoritesUserScreen extends Component {
	constructor() {
		super();
		const { currentUser } = firebase.auth();

		this._isMounted = false;
		this.refToast = React.createRef();
		this.refFavorites = firebase.database().ref().child(`Users/${currentUser.uid}/favorites`);
		this.state = {
			favoriteLocations: [],
			userName: '',
			loaded: false
		};
	}

	componentWillUnmount() {
		this._isMounted = false;
	}

	async componentDidMount() {
		this._isMounted = true;

		this._isMounted && loadDataFromDb.call(this, this.refFavorites, this.state, 'favoriteLocations');
	}

	removeFromFavorites(favoriteLocation) {
		const user = firebase.auth();
		const { currentUser } = user;

		const data = {};

		favoriteLocation.isFavorite = false;

		data[`Users/${currentUser.uid}/locations/${favoriteLocation.key}`] = favoriteLocation;

		firebase.database().ref().update(data)
			.then(() => {
				firebase.database().ref().child(`Users/${currentUser.uid}/favorites/${favoriteLocation.key}`).remove()
					.then(() => {
						this.refToast.current.show('Favorite location removed.', 1000);
					});
			});
	}

	renderItem(favoriteLocation) {
		const leftIcon = (favoriteLocation && favoriteLocation.types && favoriteLocation.types[0]) || '';

		return (
			<LocationListItem
				withBadgeIcon={{
					value: (<Icon
						Component={TouchableScale}
						size={30}
						name='heart'
						type='font-awesome'
						color='red'
						onPress={this.removeFromFavorites.bind(this, favoriteLocation)}
					/>),
					badgeStyle: { backgroundColor: 'transparent', height: 30 }
				}}
				title={favoriteLocation.name}
				subtitle={favoriteLocation.formatted_address}
				subtitleStyle={styles.itemSubTitle}
				leftIcon={{ name: typesIconsMap[leftIcon] }}
				action={goToLocationDetail.bind(this, favoriteLocation)}
			/>
		);
	}

	render() {
		const {
			loaded,
			favoriteLocations
		} = this.state;

		if (!loaded) {
			return (<PreLoader />);
		}

		if (isEmpty(favoriteLocations)) {
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
					itemsList={favoriteLocations}
					action={(favoriteLocation) => this.renderItem(favoriteLocation)}
				/>
				<Toast
					position='top'
					ref={this.refToast}
				/>
			</View>
		);
	}
}

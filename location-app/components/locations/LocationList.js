import React, { Component } from 'react';
import { View, FlatList, Text } from 'react-native';
import { ListItem } from 'react-native-elements';
import { PreLoader, Footer } from '../common';
import LocationEmpty from './LocationEmpty';
import { NavigationActions } from 'react-navigation';
import PropTypes from 'prop-types';
import TouchableScale from 'react-native-touchable-scale';

/* eslint-disable no-console, class-methods-use-this, max-len */

export default class LocationList extends Component {
	constructor(props) {
		super(props);

		const { locations } = this.props;

		this.state = {
			locations: locations,
			loaded: false
		};
	}

	componentDidMount() {
		this.setState({ loaded: true });
	}

	goToLocationDetailOnMap(location) {
		const navigateAction = NavigationActions.navigate({
			routeName: 'DetailLocationScreen',
			params: location
		});

		this.props.navigation.dispatch(navigateAction);
	}

	buildPlaceObj(mapsObj) {
		return Object.assign({}, mapsObj);
	}

	renderLocation(location) {
		const { geoCode, place } = location;

		const placeObj = this.buildPlaceObj(geoCode || place);
		const placeName = placeObj.name || placeObj.formatted_address;

		if (placeName) {
			return (
				<View>
					<ListItem
						containerStyle={{ borderBottomWidth: 1, borderColor: '#f2f2f2' }}
						Component={TouchableScale}
						titleStyle={ { fontSize: 15 }}
						title={`${placeName}`}
						leftIcon={{ name: 'pin-drop' }}
						onPress={() => this.goToLocationDetailOnMap(location)}
						rightIcon={{ name: 'arrow-forward', type: 'font-awsome' }}
						titleProps={{ ellipsizeMode: 'tail', numberOfLines: 1 }}
					/>
				</View>
			);
		}

		return null;
	}

	render() {
		const { locations, loaded } = this.state;

		if (!loaded) {
			return (<PreLoader />);
		}

		if (!locations.length) {
			return (<LocationEmpty />);
		}

		return (
			<View style={{ flex: 1 }}>
				<FlatList
					data={locations}
					renderItem={(location) => this.renderLocation(location.item)}
					keyExtractor={(item, index) => index.toString()}
					ListFooterComponent={<Footer />}
				/>
			</View>
		);
	}
}

LocationList.propTypes = {
	locations: PropTypes.array,
	navigation: PropTypes.object
};


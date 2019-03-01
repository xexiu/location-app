import React, { Component } from 'react';
import { View, Text } from 'react-native';
import PropTypes from 'prop-types';

/* eslint-disable no-console, class-methods-use-this */

export default class LocationInfoScreen extends Component {
	render() {
		const markers = this.props.navigation.state.params[0];

		return (
			<View>
				<Text>INFO LOCATION</Text>
				<Text>INFO LOCATION</Text>
				<Text>INFO LOCATION</Text>
				<Text>INFO LOCATION</Text>
				<Text>INFO LOCATION</Text>
				<Text>INFO LOCATION</Text>
			</View>
		);
	}
}

LocationInfoScreen.propTypes = {
	navigation: PropTypes.object
};

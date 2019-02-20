import React, { Component } from 'react';
import { View, Text } from 'react-native';

/* eslint-disable no-console, class-methods-use-this */

export default class LocationEmpty extends Component {
	render() {
		return (
			<View>
				<Text h1> No locations saved! Please give me more time...</Text>
			</View>
		);
	}
}

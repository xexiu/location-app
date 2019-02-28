import React, { Component } from 'react';
import { View, Text, Dimensions } from 'react-native';
const { width } = Dimensions.get('window');

/* eslint-disable no-console, class-methods-use-this */

const styles = {
	offlineContainer: {
		backgroundColor: '#b52424',
		height: 30,
		justifyContent: 'center',
		alignItems: 'center',
		flexDirection: 'row',
		width,
		position: 'absolute',
		top: 0
	},
	offlineText: {
		color: '#fff'
	}
};

export class OfflineNotice extends Component {
	render() {
		return (
			<View style={styles.offlineContainer}>
				<Text style={styles.offlineText}>No Internet Connection</Text>
			</View>);
	}
}

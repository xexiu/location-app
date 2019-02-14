import React, { Component } from 'react';
import { ActivityIndicator, View } from 'react-native';
/* eslint-disable class-methods-use-this */

const styles = {
	preloader: {
		flex: 1,
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center'
	}
};

export class PreLoader extends Component {
	render() {
		return (
			<View style={styles.preloader}>
				<ActivityIndicator style={{ height: 80 }} size="large" />
			</View>
		);
	}
}

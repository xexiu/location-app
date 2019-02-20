import React, { Component } from 'react';
import { View } from 'react-native';
import * as Progress from 'react-native-progress';
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
				<Progress.Pie progress={0.4} size={30} indeterminate={true} />
			</View>
		);
	}
}

import React, { Component } from 'react';
import { View } from 'react-native';
import { ListItem } from 'react-native-elements';
import TouchableScale from 'react-native-touchable-scale';
import PropTypes from 'prop-types';

/* eslint-disable no-console, class-methods-use-this */

function defaultFun() {
	console.log('LocationListItem');
}

export default class LocationListItem extends Component {
	render() {
		const {
			title,
			action = defaultFun,
			leftIcon = { name: 'pin-drop' },
			rightIcon = { name: 'arrow-forward', type: 'font-awsome' }
		} = this.props;

		return (
			<View>
				<ListItem
					containerStyle={{ borderBottomWidth: 1, borderColor: '#f2f2f2' }}
					Component={TouchableScale}
					titleStyle={ { fontSize: 15 }}
					title={title}
					leftIcon={leftIcon}
					onPress={action}
					rightIcon={rightIcon}
					titleProps={{ ellipsizeMode: 'tail', numberOfLines: 1 }}
				/>
			</View>
		);
	}
}

LocationListItem.propTypes = {
	action: PropTypes.func,
	title: PropTypes.string,
	leftIcon: PropTypes.object,
	rightIcon: PropTypes.object
};

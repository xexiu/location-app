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
			withBadgeIcon,
			title,
			titleStyle = { fontSize: 15 },
			subtitleStyle,
			subtitle,
			action = defaultFun,
			leftIcon = { name: 'pin-drop' },
			rightIcon = { name: 'arrow-forward', type: 'font-awsome' }
		} = this.props;

		return (
			<View>
				<ListItem
					badge={withBadgeIcon}
					bottomDivider
					Component={TouchableScale}
					title={title}
					titleStyle={titleStyle}
					subtitle={subtitle}
					subtitleStyle={subtitleStyle}
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
	withBadgeIcon: PropTypes.object,
	action: PropTypes.func,
	title: PropTypes.string,
	titleStyle: PropTypes.object,
	subtitle: PropTypes.string,
	subtitleStyle: PropTypes.object,
	leftIcon: PropTypes.object,
	rightIcon: PropTypes.object
};

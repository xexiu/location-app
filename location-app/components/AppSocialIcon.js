import React, { Component } from 'react';
import { SocialIcon } from 'react-native-elements';
import PropTypes from 'prop-types';

const defaultAction = evt => {
	// eslint-disable-next-line
	return console.log('Button Pressed AppSocialIcon: ', evt);
};

export class AppSocialIcon extends Component {
	render() {
		const {
			socialIconStyle,
			socialIconTitle,
			socialIconButton = false,
			socialIconType,
			socialIconSize,
			socialIconOnPress = defaultAction,
			socialIconLight = false,
			socialIconUnderlayColor = 'rgba(31, 15, 12, 0.9)'
		} = this.props;

		return (
			<SocialIcon
				style={socialIconStyle}
				light={socialIconLight}
				title={socialIconTitle}
				button={socialIconButton}
				type={socialIconType}
				iconSize={socialIconSize}
				onPress={socialIconOnPress}
				underlayColor={socialIconUnderlayColor}
			/>
		);
	}
}

AppSocialIcon.propTypes = {
	socialIconStyle: PropTypes.object,
	socialIconTitle: PropTypes.string,
	socialIconButton: PropTypes.bool,
	socialIconType: PropTypes.string,
	socialIconSize: PropTypes.number,
	socialIconOnPress: PropTypes.func,
	socialIconLight: PropTypes.bool,
	socialIconUnderlayColor: PropTypes.string
};

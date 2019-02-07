import React, { Component } from 'react';
import { SocialIcon } from 'react-native-elements';

const defaultAction = evt => {
    // eslint-disable-next-line
	return console.log('Button Pressed', evt);
};
export class AppSocialIcon extends Component {
	render() {
		const {
            socialIconStyle,
            socialIconTitle,
            socialIconButton = false,
            socialIconType,
            socialIconSize,
            socialIconOnPress,
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
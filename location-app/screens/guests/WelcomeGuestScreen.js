import React, { Component } from 'react';
import { View } from 'react-native';
import { AppButton, AppSocialIcon, BackgroundImage } from '../../components/common';
import { buttonsStyle, containerStyle } from '../../styles/index';
import PropTypes from 'prop-types';
import { facebookLogin } from '../../actions';

/* eslint-disable no-console */

export default class WelcomeGuestScreen extends Component {
	render() {
		return (
			<BackgroundImage
				source={require('../../../assets/images/backgroundApp.png')}
			>
				<View style={containerStyle.mainGuestLoginContainer}>
					<AppButton
						btnTitle="Login"
						btnStyle={buttonsStyle.buttonsLoginStyle}
						btnOnPress={(evt) => this.props.navigation.navigate('LoginGuestScreen')}
					/>
					<AppButton
						btnTitle="Register"
						btnStyle={buttonsStyle.buttonsLoginStyle}
						btnOnPress={(evt) => this.props.navigation.navigate('RegisterGuestScreen')}
					/>

					<View>
						<AppSocialIcon
							socialIconStyle={buttonsStyle.socialIconStyleFacebookLogin}
							socialIconButton
							socialIconTitle="Login with Facebook"
							socialIconType="facebook"
							socialIconOnPress={(evt) => facebookLogin()}
						/>
					</View>
				</View>
			</BackgroundImage>
		);
	}
}

WelcomeGuestScreen.propTypes = {
	facebookLogin: PropTypes.func,
	login: PropTypes.func,
	navigation: PropTypes.object
};

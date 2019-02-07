import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import { AppButton, AppSocialIcon, BackgroundImage } from '../../components';
import { buttonsStyle, containerStyle } from '../../styles/index';
import * as actions from '../../actions';
import PropTypes from 'prop-types';

/* eslint-disable no-console */

export class WelcomeGuestScreen extends Component {
	render() {
		return (
			<BackgroundImage
				source={require('../../../assets/images/backgroundApp.png')}
			>
				<View style={containerStyle.mainGuestLoginContainer}>
					<AppButton
						btnTitle="Login"
						btnStyle={buttonsStyle.buttonsLoginStyle}
						btnOnPress={(evt) => console.log('BYEEE')}
					/>
					<AppButton
						btnTitle="Register"
						btnStyle={buttonsStyle.buttonsLoginStyle}
						btnOnPress={(evt) => console.log('REGISTER')}
					/>

					<View>
						<AppSocialIcon
							socialIconStyle={buttonsStyle.socialIconStyleFacebookLogin}
							socialIconButton
							socialIconTitle="Login with Facebook"
							socialIconType="facebook"
							socialIconOnPress={(evt) => this.props.facebookLogin()}
						/>
					</View>
				</View>
			</BackgroundImage>
		);
	}
}

function mapStateToProps({ auth }) {
	return {
		fbLogin: auth.fbLogin
	};
}
WelcomeGuestScreen.propTypes = { facebookLogin: PropTypes.func };

export default connect(mapStateToProps, actions)(WelcomeGuestScreen);

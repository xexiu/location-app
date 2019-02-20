import React, { Component } from 'react';
import { Button } from 'react-native-elements';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/FontAwesome';

function defaultAction(evt) {
	// eslint-disable-next-line
	return console.log('Button Pressed AppButton: ', evt);
}

export class AppButton extends Component {
	render() {
		const {
			btnTitle = 'No btn title!',
			btnStyle = { backgroundColor: 'transparent' },
			btnLoading = false,
			btnRaised = false,
			btnType = 'solid',
			btnOnPress = defaultAction,
			btnIcon
		} = this.props;

		return (
			<Button
				icon={btnIcon}
				loading={btnLoading}
				title={btnTitle}
				type={btnType}
				raised={btnRaised}
				buttonStyle={btnStyle}
				onPress={btnOnPress}
			/>
		);
	}
}

AppButton.propTypes = {
	btnStyle: PropTypes.object,
	btnTitle: PropTypes.string,
	btnLoading: PropTypes.bool,
	btnType: PropTypes.string,
	btnOnPress: PropTypes.func,
	btnRaised: PropTypes.bool,
	btnIcon: PropTypes.node
};


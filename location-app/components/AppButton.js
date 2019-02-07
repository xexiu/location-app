import React, { Component } from 'react';
import { Button } from 'react-native-elements';

function defaultAction(evt) {
    // eslint-disable-next-line
	return console.log('Button Pressed', evt);
}

export class AppButton extends Component {
	render() {
		const {
            btnTitle = 'No btn title!',
            btnStyle,
            btnLoading = false,
            btnRaised = false,
            btnType = 'solid',
            btnOnPress = defaultAction
        } = this.props;

		return (
            <Button
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


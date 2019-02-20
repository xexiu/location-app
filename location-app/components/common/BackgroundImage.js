import React, { Component } from 'react';
import { ImageBackground } from 'react-native';
import PropTypes from 'prop-types';

export class BackgroundImage extends Component {
	render() {
		const { source, children } = this.props;

		return (
			<ImageBackground
				source={source}
				style={{ flex: 1, width: null, height: null }}
			>
				{children}
			</ImageBackground>
		);
	}
}

BackgroundImage.propTypes = {
	source: PropTypes.number,
	children: PropTypes.object
};

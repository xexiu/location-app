import React, { Component } from 'react';
import { Text } from 'react-native';
import PropTypes from 'prop-types';

/* eslint-disable class-methods-use-this */

const defaultStyle = {
	marginTop: 5,
	color: '#bbb',
	fontSize: 12,
	fontWeight: 'bold'
};

export class TextCard extends Component {
	render() {
		const {
			text,
			textStyle,
			linesEllipsis = 1
		} = this.props;

		return (
			<Text
				ellipsizeMode='tail'
				numberOfLines={linesEllipsis}
				style={[defaultStyle, textStyle]}>
				{text}
			</Text>
		);
	}
}

TextCard.propTypes = {
	text: PropTypes.string,
	textStyle: PropTypes.array,
	linesEllipsis: PropTypes.number
};

import React, { Component } from 'react';
import { Text } from 'react-native';
import { getCurrentYear } from '../../utils';
import { footerStyle } from '../../styles';

/* eslint-disable no-console, class-methods-use-this */

const year = getCurrentYear();

export class Footer extends Component {
	render() {
		return (
			<Text style={footerStyle.container}>Copyright S.M. - {year}</Text>
		);
	}
}

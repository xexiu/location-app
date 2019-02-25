import React, { Component } from 'react';
import { FlatList, ScrollView } from 'react-native';
import { Footer } from '../common';
import PropTypes from 'prop-types';

/* eslint-disable no-console, class-methods-use-this */

function defaultFun(item) {
	console.log('LocationList', item);
}

export default class LocationList extends Component {
	render() {
		const {
			itemsList,
			hasFooter = true,
			action = defaultFun
		} = this.props;

		return (
			<ScrollView keyboardShouldPersistTaps="always">
				<FlatList
					keyboardShouldPersistTaps="always"
					data={itemsList}
					renderItem={item => action(item.item)}
					keyExtractor={(item, index) => index.toString()}
					ListFooterComponent={hasFooter ? <Footer /> : ''}
				/>
			</ScrollView>
		);
	}
}

LocationList.propTypes = {
	user: PropTypes.object,
	itemsList: PropTypes.array,
	hasFooter: PropTypes.bool,
	action: PropTypes.func
};


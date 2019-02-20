import React, { Component } from 'react';
import { Marker } from 'react-native-maps';
import PropTypes from 'prop-types';

export default class LocationMarker extends Component {
	render() {
		const {
			marker,
			coords,
			actionOnDragEnd = () => {}
		} = this.props;

		return (
			<Marker draggable
				coordinate={coords}
				title={marker.name}
				description={marker.formatted_address}
				onDragEnd={actionOnDragEnd}
				key={(item, index) => index.toString()}
			/>
		);
	}
}

LocationMarker.propTypes = {
	marker: PropTypes.object,
	coords: PropTypes.object,
	actionOnDragEnd: PropTypes.func
};

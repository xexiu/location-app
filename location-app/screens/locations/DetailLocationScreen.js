import React, { Component } from 'react';
import { View } from 'react-native';
import { MapView, Permissions } from 'expo';
import { Icon } from 'react-native-elements';
import { PreLoader } from '../../components/common';
import PropTypes from 'prop-types';
import TouchableScale from 'react-native-touchable-scale';
import { Marker } from 'react-native-maps';
import { buttonsStyle } from '../../styles';

/* eslint-disable no-console, class-methods-use-this */

export default class DetailLocationScreen extends Component {
	constructor(props) {
		super(props);

		this._isMounted = false;
		this.state = {
			ready: true,
			loaded: false,
			markers: [],
			region: {
				longitude: 0,
				latitude: 0,
				longitudeDelta: 0.01,
				latitudeDelta: 0.01
			}
		};
	}

	componentWillUnmount() {
		this._isMounted = false;
	}

	async componentDidMount() {
		this._isMounted = true;
		const { status } = await Permissions.askAsync(Permissions.LOCATION);

		if (status === 'granted') {
			const { params } = this.props.navigation.state;
			const { location } = params.geometry;
			const types = params.types;
			const description = types && String(types).replace(/\,/g, ' - ');

			location['name'] = params.name;
			location['description'] = description;

			this._isMounted && this.setState({
				loaded: true,
				markers: [location]
			});

			this._isMounted && this.map.animateToRegion({
				...this.state.region,
				latitude: location.lat,
				longitude: location.lng
			});
		}
	}

	onMapReady = (e) => {
		if (!this.state.ready) {
			this.setState({ ready: true });
		}
	};

	onChangeTextInput(evt) {
		// evt
	}

	onSubmitEditingInput(evt) {
		// evt
	}

	render() {
		const { loaded } = this.state;

		if (!loaded) {
			return (<PreLoader />);
		}

		return (
			<View style={{ flex: 1 }}>
				<MapView
					initialRegion={this.state.region}
					ref={ref => { this.map = ref; }}
					style={{ flex: 1 }}
					mapType="standard"
					zoomEnabled
					pitchEnabled
					showsBuildings
					showsTraffic
					showsIndoors
					loadingEnabled={true}
					onPress={(evt) => console.log('Pressed on map: ', evt)}
					onMarkerPress={() => { console.log('Pin pressed'); }}
					onRegionChangeComplete={(region) => {
						if (this.state.ready) {
							this.setState({ region });
						}
					}}
					onMapReady={this.onMapReady}
				>
					{this.state.markers.map(marker => (
						<Marker
							coordinate={{
								latitude: marker.lat,
								longitude: marker.lng
							}}
							title={marker.name}
							description={marker.description}
							key={(item, index) => index.toString()}
						>
						</Marker>
					))}
				</MapView>
				<View style={buttonsStyle.detailLocationBtns}>
					<Icon
						Component={TouchableScale}
						size={30}
						name='trash'
						type='font-awesome'
						color='white'
						onPress={() => console.log('Delete')} />

					<Icon
						Component={TouchableScale}
						size={30}
						name='pencil'
						type='font-awesome'
						color='white'
						onPress={() => console.log('Edit')} />

					<Icon
						Component={TouchableScale}
						size={30}
						name='share-alt'
						type='font-awesome'
						color='white'
						onPress={() => console.log('Share')} />
				</View>
			</View>
		);
	}
}

DetailLocationScreen.propTypes = {
	navigation: PropTypes.object
};

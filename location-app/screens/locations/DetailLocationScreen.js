import React, { Component } from 'react';
import { View, Alert, Text, Modal, TextInput } from 'react-native';
import { MapView, Permissions } from 'expo';
import { Icon } from 'react-native-elements';
import { PreLoader, AppButton } from '../../components/common';
import PropTypes from 'prop-types';
import TouchableScale from 'react-native-touchable-scale';
import { buttonsStyle } from '../../styles';
import * as firebase from 'firebase';
import { NavigationActions } from 'react-navigation';
import Toast from 'react-native-easy-toast';
import { buildMarker } from '../../utils/location';

/* eslint-disable no-console, class-methods-use-this */

export default class DetailLocationScreen extends Component {
	constructor(props) {
		super(props);

		this._isMounted = false;
		this.refToast = React.createRef();
		this.state = {
			isModalVisible: false,
			locationName: '',
			ready: true,
			loaded: false,
			markers: [],
			visible: false,
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
			const { location } = this.props.navigation.state.params;

			this._isMounted && this.setState({
				loaded: true,
				markers: [location]
			});

			this._isMounted && this.map.animateToRegion({
				...this.state.region,
				latitude: location.geometry.location.lat,
				longitude: location.geometry.location.lng
			});
		}
	}

	onMapReady = (e) => {
		if (!this.state.ready) {
			this.setState({ ready: true });
		}
	};

	updateItem() {
		this.setState({ isModalVisible: false });

		const { location, user } = this.props.navigation.state.params;
		const { currentUser } = user;
		const { locationName } = this.state;

		firebase.database().ref().child(`Users/${currentUser.uid}/locations/${location.key}`).update({
			name: locationName
		}, () => {
			const navigateAction = NavigationActions.navigate({
				routeName: 'LandingUserScreen'
			});

			this.refToast.current.show('Location name updated', 1000, () =>{
				this.props.navigation.dispatch(navigateAction);
			});
		});
	}

	deleteItem() {
		const { location, user } = this.props.navigation.state.params;
		const { currentUser } = user;

		firebase.database().ref().child(`Users/${currentUser.uid}/locations/${location.key}`).remove(() => {
			const navigateAction = NavigationActions.navigate({
				routeName: 'LandingUserScreen'
			});

			this.refToast.current.show('Location removed', 1000, () =>{
				this.props.navigation.dispatch(navigateAction);
			});
		});
	}

	showAlert() {
		Alert.alert(
			'Delete saved Location?',
			'This action is permanent.',
			[
				{ text: 'Ask me later', onPress: () => console.log('Ask me later pressed') },
				{
					text: 'Cancel',
					onPress: () => console.log('Cancel Pressed'),
					style: 'cancel'
				},
				{ text: 'OK', onPress: this.deleteItem.bind(this) }
			],
			{ cancelable: false },
		);
	}

	handleLocationName(text) {
		this.setState({ locationName: text });
	}

	render() {
		const {
			loaded,
			markers,
			isModalVisible
		} = this.state;

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
					{buildMarker(markers)}
				</MapView>
				<View>
					<Modal
						visible={isModalVisible}
						transparent={true}
						animationType="slide"
					>
						<View style={{
							backgroundColor: 'rgba(31, 15, 12, 0.6)',
							flex: 1,
							justifyContent: 'center',
							alignItems: 'center'
						}}>
							<Text
								style={
									{
										color: 'white',
										fontSize: 20,
										fontWeight: 'bold'
									}
								}
							>Enter a name for this location!</Text>
							<TextInput
								style={{
									backgroundColor: 'white',
									padding: 4,
									height: 40,
									width: 190,
									marginTop: 5,
									marginBottom: 5,
									borderRadius: 5
								}}
								underlineColorAndroid="transparent"
								placeholderTextColor="#9a73ef"
								autoCapitalize="none"
								onChangeText={this.handleLocationName.bind(this)}
								onSubmitEditing={this.updateItem.bind(this)}
							/>

							<AppButton
								btnTitle="Cancel"
								btnStyle={buttonsStyle.buttonsLoginStyle}
								btnOnPress={() => this.setState({ isModalVisible: false })}
							/>
						</View>
					</Modal>
				</View>
				<View style={buttonsStyle.detailLocationBtns}>
					<Icon
						Component={TouchableScale}
						size={30}
						name='trash'
						type='font-awesome'
						color='white'
						onPress={this.showAlert.bind(this)}
					/>

					<Icon
						Component={TouchableScale}
						size={30}
						name='pencil'
						type='font-awesome'
						color='white'
						onPress={() => this.setState({ isModalVisible: true })} />

					<Icon
						Component={TouchableScale}
						size={30}
						name='share-alt'
						type='font-awesome'
						color='white'
						onPress={() => console.log('Share')} />
				</View>
				<Toast
					position='top'
					ref={this.refToast}
				/>
			</View>
		);
	}
}

DetailLocationScreen.propTypes = {
	navigation: PropTypes.object
};

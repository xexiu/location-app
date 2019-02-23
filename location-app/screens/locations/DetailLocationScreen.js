import React, { Component } from 'react';
import { View, Alert, Text, Modal, TextInput, Image } from 'react-native';
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
import { connect } from 'react-redux';
import * as actions from '../../actions';
import { GOOGLE_MAPS_API_KEY } from '../../constants/Apis';

const ROOT_API = 'https://maps.googleapis.com/maps/api/';

/* eslint-disable no-console, class-methods-use-this */

class DetailLocationScreen extends Component {
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
		const navigateAction = NavigationActions.navigate({
			routeName: 'LandingUserScreen'
		});

		this.props.updateItem(location, currentUser, locationName);

		locationName.length >= 3
			?
			this.refToast.current.show('Location name updated', 1000, () =>{
				this.props.navigation.dispatch(navigateAction);
			})
			:
			this.refToast.current.show('Location name is too short! Min: 3 letters', 1500);
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

	_renderItem({ item, index }) {
		console.log('Item', item);

		return (
			<View style={{}}>
				<Text style={{}}>{ item.uri }</Text>
			</View>
		);
	}

	render() {
		const {
			loaded,
			markers,
			isModalVisible
		} = this.state;

		const reference = markers[0] && markers[0].photos && markers[0].photos[0].photo_reference;
		const photo = `${ROOT_API}place/photo?maxwidth=400&photoreference=${reference}&key=${GOOGLE_MAPS_API_KEY}`;

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


				<View style={
					{
						alignSelf: 'center',
						justifyContent: 'center',
						flexDirection: 'row',
						flexWrap: 'wrap',
						shadowOffset: { width: 10, height: 10 },
						shadowColor: 'black',
						shadowOpacity: 0.2,
						width: 300,
						height: 300,
						bottom: 10,
						position: 'absolute'
					}
				}>
					<View>
						<Image
							style={{ width: 100, height: 300, borderRadius: 4 }}
							source={{ uri: photo }}
						/>
					</View>
					<View style={{
						marginTop: 10,
						paddingLeft: 20,
						height: 280,
						width: 200,
						backgroundColor: 'white'
					}}>
						<Text>HELLO</Text>
						<Text>HELLO</Text>
					</View>
				</View>



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

function mapStateToProps({ locationUpdated }) {
	return {
		locationUpdated: locationUpdated.name
	};
}

export default connect(mapStateToProps, actions)(DetailLocationScreen);

DetailLocationScreen.propTypes = {
	navigation: PropTypes.object,
	updateItem: PropTypes.func
};

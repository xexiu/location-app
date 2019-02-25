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
const DEFAULT_PHOTO = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAkFBMVEX////0NzT8YGD0NDH0LyzzIBvzHhnzJCD0Kib0JyP8YmL0Mi/6rKv6tbTzGhX6s7L+8PD7W1v2Y2H1W1n93t7+8vL4j437vr31U1H2Z2X81NT/+Pj5mJf5oJ/+6en8y8r2c3HzAAD0Pjv5pqX1RkT3fHv2b230PDn94eH3g4H1TEn6VVX82dj8zcz4lJL1VVIAPN2UAAAE90lEQVR4nO3ca3eaQBAG4BAuC0JQ6/0StcQkRmn7//9dWYyVuLMGSOoynPf50HN6uh9musPssgJ3dwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/T281TIernukw/o/502bvxZ7rutmf283T3HRA32v+5ru+Y1sntpP9/a09SUZbz7FUjreNTIf2LZ78IJ88236fQ/vfXNqB/2Q6vC9bJ3l+tr3dH/r3uf4+Oecokl+mQ/ySxXNsy/SSQ6dzf9bZFi7J+HlhOsz6dpYvc9j2i+nl03jO0LL8153pQOua5BOYKPnddw7FDK0wXpsOtZ5uLCdwf8xPVmn/IPX7/f1lW427poOtI0/QOsgEO/eHbSKb6YmycsQPpsOtbpInmLfPQ0IldZHixHTAVaX/Etxbn2V3THFoOuRqFnKLZvc7nUO5/LLBIa9F4yXbptmHTj8pmV/GeTEddBUTL++i+/L5ZTxOl2KYpZYUdy6l6tQyHXZ5S7mVua+YoGUFS9OBlzUS8iKsnGCW4sh06CXJKUyqXYNHPpdJDLJga8ygnETToZczEXWSywke7fSFOrI4cnwhhH/l31msiQtfE34oxHM0WU+ijSdCzRifw8ZmrSlSd3A+r1gPXM0gDneKS3IOQ/Hx/ujBJVsRi246oCowfF1dDNtZ5LgfRmKuxiMCtx31JL/nULPoGoi4ol5MxO2lxMiU+r+Im7+tGRI9xP9NDqWuWLf5N8K/iFYaaNYAYqho/gExsaNxxpqxv9VJZLCrITJ0dT8yEVcizwwd7WB1/8Ygw7mSYfhHO3iqrImi+ZuaoVJ54Uw7eKZk6FLrSrOo62GlDL3LvU8DqRnqq1Td4cU3jLSu/WXUdqgdqxz229sbRlrXWGmQnm6fslOuWeftprHWoy4X2luiR2XFD5q/WGStRtmYasv0Vbm74NBoqPYR0E9cROrSOb1xrPV0g8vALUFNTU/dlTJ5+GSh3iGGVItUmm62VjB55O1Z3W46U+UG6gcxamMg2jrURSAL/vXjDcZwS5yaapeVxiEm0bK9zfmxmd7YI86h2Ezh8ccnIoF48DjfrVbDhxePPHH0mFyFUkQf+Ia+cDMBfawvWD2pSLSRzzgD00FX0qv++xO5ZjZYV/PDhD5BVjUqVaxTZjUq9dS929UpZFajUqU6ddnVqDQoX6cMa1Sq0E8Fo7W+qHSdugyfLj0q2U+Z1qhUsp8GTGtUKlWnfGtUKlGnjv5InIMS/ZRrHz35tE5dli8iFM2u16nD4fGS60bXJ5HTfb3Ow7UUeffRkyv9tAU1Ko2oJ4Pep7D5zweVou2n7ahRSdNPma/1RT26TkVLalQi65TVOzKfon6GaU+NSsT+1G3BWl+krPv896OXLuq0JWt90cj/8FgCm1ecKvhQp+1Z64sKddqyPnpyPpey/Zb10ZOH09bGa2WNSu/70xb20ZPRsU65nz1dk9dpe2tUevF8j8U7hvV1x63brQEAAAAAwG0t0nX0uFwuH6N1yuETJtXsok0SuyLwpUC48XYTsf2mJyGdesHFVzBsJ/D+NP+d35KWMf3BnTB+NB3a91j9JPOTfjJ89pmw0EyhnMSWdJw0Ib8LFYqkNRfiXTR1hR8WPgAt3w+asnx6Xas3Gc+s/LP68sP61mw8aeex8GqYpumwHe0FAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAmuovfI47w2pZpPEAAAAASUVORK5CYII=';

/* eslint-disable no-console, class-methods-use-this, complexity */

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

		const types = markers[0] && markers[0].types;
		const defaultTypes = !!types && types.length > 1 ? `${types[0]} / ${types[1].replace(/_/g, ' ')}` : (!!types && types[0].replace(/_/g, ' '));
		const reference = markers[0] && markers[0].photos && markers[0].photos[0].photo_reference;
		const name = markers[0] && markers[0].name;
		const phoneOrVicinity = markers[0] && (markers[0].international_phone_number || markers[0].vicinity);
		const rating = markers[0] && markers[0].rating;
		const totalRating = markers[0] && markers[0].user_ratings_total;
		const open = (markers[0] && markers[0].opening_hours && markers[0].opening_hours.open_now) || '';
		const photo = `${ROOT_API}place/photo?maxwidth=400&photoreference=${reference}&key=${GOOGLE_MAPS_API_KEY}`;

		if (!loaded) {
			return (<PreLoader />);
		}

		return (
			<View style={{ flex: 1, position: 'relative' }}>
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
							style={{
								borderWidth: 1,
								borderColor: '#ddd',
								width: 100, height: 300, borderRadius: 4 }}
							source={{ uri: !!reference ? photo : DEFAULT_PHOTO }}
						/>
					</View>
					<View style={{
						marginTop: 10,
						paddingLeft: 20,
						height: 280,
						width: 200,
						backgroundColor: 'white',
						paddingTop: 10
					}}>
						<Text
							ellipsizeMode='tail'
							numberOfLines={1}
							style={{
								color: '#ccc',
								fontSize: 12,
								fontWeight: 'bold',
								textTransform: 'uppercase'
							}}>
							{defaultTypes}
						</Text>
						<Text
							ellipsizeMode='tail'
							numberOfLines={2}
							style={{
								marginTop: 10,
								fontSize: 18,
								fontWeight: 'bold',
								textTransform: 'uppercase'
							}}>
							{name}
						</Text>
						<Text
							ellipsizeMode='tail'
							numberOfLines={1}
							style={{
								marginTop: 10,
								color: '#ccc',
								fontSize: 14,
								fontWeight: 'bold',
								textTransform: 'uppercase'
							}}>
							{phoneOrVicinity}
						</Text>
						<Text
							ellipsizeMode='tail'
							numberOfLines={1}
							style={{
								marginTop: 5,
								color: '#ccc',
								fontSize: 12,
								fontWeight: 'bold',
								textTransform: 'capitalize'
							}}>
							{!!rating ? `Stars: ${rating} / 5` : '' }
						</Text>
						<Text ellipsizeMode='tail'
							numberOfLines={1}
							style={{
								marginTop: 5,
								color: '#ccc',
								fontSize: 12,
								fontWeight: 'bold',
								textTransform: 'capitalize'
							}}>
							{!!totalRating ? `${totalRating} reviews` : '' }
						</Text>
						<Text style={{
							marginTop: 5,
							color: '#ccc',
							fontSize: 12,
							fontWeight: 'bold'
						}}>
							{!!open ? 'Open Now: Yes' : 'Open Now: No'}
						</Text>
						<View>
							<AppButton
								btnIcon={(<Icon
									Component={TouchableScale}
									raised
									name='info'
									type='font-awesome'
									color='#f50'
									onPress={() => console.log('InfoDetailLocation')}
								/>)}
								btnTitle="Infos"
								btnStyle={{ backgroundColor: 'transparent' }}
							/>
						</View>

						<View style={buttonsStyle.detailLocationBtns}>
							<Icon
								Component={TouchableScale}
								size={30}
								name='trash'
								type='font-awesome'
								color='red'
								onPress={this.showAlert.bind(this)}
							/>

							<Icon
								Component={TouchableScale}
								size={30}
								name='pencil'
								type='font-awesome'
								color='red'
								onPress={() => this.setState({ isModalVisible: true })} />

							<Icon
								Component={TouchableScale}
								size={30}
								name='share-alt'
								type='font-awesome'
								color='red'
								onPress={() => console.log('Share')} />
						</View>

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

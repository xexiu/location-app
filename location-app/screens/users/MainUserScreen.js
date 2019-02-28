import React from 'react';
import {
	createStackNavigator,
	createAppContainer,
	createDrawerNavigator
} from 'react-navigation';
import * as firebase from 'firebase';
import { getCurrentPosition } from '../../utils/google';
import Icon from 'react-native-vector-icons/FontAwesome';
import { buttonsStyle } from '../../styles';
import LandingUserScreen from './LandingUserScreen';
import FavoritesUserScreen from './FavoritesUserScreen';
import LogoutUserScreen from '../users/LogoutUserScreen';
import DetailLocationScreen from '../locations/DetailLocationScreen';
import SaveCurrentLocationScreen from '../locations/SaveCurrentLocationScreen';
import LocationInfoScreen from '../locations/LocationInfoScreen';

let currentUserPosition;

/* eslint-disable max-len */

const { headerButtons } = buttonsStyle;
const navigationOptions = {
	defaultNavigationOptions: {
		headerStyle: {
			backgroundColor: '#f4511e' // red-orange of the header
		},
		headerTintColor: 'white',
		headerTitleStyle: {
			textAlign: 'center',
			alignSelf: 'center',
			fontSize: 20,
			color: '#fff',
			fontWeight: 'bold'
		}
	}
};

async function catchErrLocation() {
	const userPosition = await getCurrentPosition();

	currentUserPosition = userPosition;

	return userPosition;
}

function openSideBar(navigation) {
	return function() {
		return navigation.openDrawer();
	};
}

function navigateTo(navigation, screenName) {
	return function() {
		return navigation.navigate(screenName, {
			user: firebase.auth(),
			currentPosition: currentUserPosition
		});
	};
}

function buildIcon(icon, style, size, color, action) {
	return (<Icon
		name={icon}
		style={style}
		size={size}
		color={color}
		onPress={action}
	/>);

}

function getDrawerIcon(iconName, tintColor) {
	return (
		<Icon name={iconName} size={20} color={tintColor} />
	);
}

const MainNavigationStacks = createStackNavigator(
	{
		DetailLocationScreen: {
			screen: DetailLocationScreen,
			navigationOptions: ({ navigation }) => ({
				title: 'Location',
				headerRight: buildIcon('home', headerButtons.btnRightStyle, 30, 'white', navigateTo(navigation, 'LandingUserScreen')),
				headerLeft: buildIcon('long-arrow-left', headerButtons.btnLeftStyle, 30, 'white', () => { navigation.goBack(null); })
			})
		},
		SaveCurrentLocationScreen: {
			screen: SaveCurrentLocationScreen
		},
		FavoritesUserScreen: {
			screen: FavoritesUserScreen,
			navigationOptions: ({ navigation }) => ({
				title: 'Favorite Locations',
				headerRight: buildIcon('location-arrow', [headerButtons.btnRightStyle], 30, 'white', navigateTo(navigation, 'SaveCurrentLocationScreen')),
				headerLeft: buildIcon('bars', headerButtons.btnLeftStyle, 30, 'white', openSideBar(navigation))
			})
		},
		LocationInfoScreen: {
			screen: LocationInfoScreen
		}
	},
	navigationOptions
);

const landingUserScreenStack = createStackNavigator(
	{
		LandingUserScreen: {
			screen: LandingUserScreen,
			navigationOptions: ({ navigation }) => ({
				title: 'Locations',
				headerRight: buildIcon('location-arrow', [headerButtons.btnRightStyle], 30, 'white', navigateTo(navigation, 'SaveCurrentLocationScreen')),
				headerLeft: buildIcon('bars', headerButtons.btnLeftStyle, 30, 'white', openSideBar(navigation))
			})
		}
	},
	{
		initialRouteName: 'LandingUserScreen', // Must be the same as the Route Name from above
		initialRouteParams: catchErrLocation(),
		defaultNavigationOptions: {
			headerStyle: {
				backgroundColor: '#f4511e'
			},
			headerTintColor: 'white',
			headerTitleStyle: {
				textAlign: 'center',
				alignSelf: 'center',
				fontSize: 20,
				fontWeight: 'bold',
				color: '#fff'
			}
		}
	}
);

const favoritesUserScreenStack = createStackNavigator(
	{
		FavoritesUserScreen: {
			screen: FavoritesUserScreen,
			navigationOptions: ({ navigation }) => ({
				title: 'Favorite Locations',
				headerRight: buildIcon('home', headerButtons.btnRightStyle, 30, 'white', navigateTo(navigation, 'LandingUserScreen')),
				headerLeft: buildIcon('bars', headerButtons.btnLeftStyle, 30, 'white', openSideBar(navigation))
			})
		}
	},
	navigationOptions
);

const logoutUserScreenStack = createStackNavigator(
	{
		LogoutUserScreen: {
			screen: LogoutUserScreen
		}
	},
	navigationOptions
);

const SideBar = createDrawerNavigator(
	{
		LandingUserScreen: {
			screen: landingUserScreenStack,
			navigationOptions: {
				title: 'Locations', // side bar item name
				drawerIcon: ({ tintColor }) => (getDrawerIcon('home', tintColor))
			}
		},
		FavoritesUserScreen: {
			screen: favoritesUserScreenStack,
			navigationOptions: {
				drawerLabel: 'Favorite Locations', // side bar item name
				drawerIcon: ({ tintColor }) => (getDrawerIcon('heart', tintColor))
			}
		},
		LogoutUserScreen: {
			screen: logoutUserScreenStack,
			navigationOptions: {
				drawerLabel: 'Logout', // side bar item name
				drawerIcon: ({ tintColor }) => (getDrawerIcon('sign-out', tintColor))
			}
		}
	},
	{
		drawerBackgroundColor: 'rgba(22, 35, 60, 0.7)', // blue-marine sidebar color
		contentOptions: {
			activeTintColor: 'white',
			activeBackgroundColor: 'transparent',
			inactiveTintColor: 'white',
			itemsContainerStyle: {
				marginVertical: 0
			}
		},
		defaultNavigationOptions: navigationOptions
	}
);

const AppScreen = createStackNavigator(
	{
		SideBar: {
			screen: SideBar
		},
		MainNavigationStacks: {
			screen: MainNavigationStacks
		}
	},
	{
		//mode: 'modal',
		headerMode: 'none'
	}
);

export default createAppContainer(AppScreen);

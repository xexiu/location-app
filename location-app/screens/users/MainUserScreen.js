import React from 'react';
import {
	createStackNavigator,
	createAppContainer,
	createDrawerNavigator
} from 'react-navigation';
import Icon from 'react-native-vector-icons/FontAwesome';
import { buttonsStyle } from '../../styles';
import LandingUserScreen from './LandingUserScreen';
import FavoritesUserScreen from './FavoritesUserScreen';
import LogoutUserScreen from '../users/LogoutUserScreen';
import DetailLocationScreen from '../locations/DetailLocationScreen';
import SaveCurrentLocationScreen from '../locations/SaveCurrentLocationScreen';

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

function openSideBar(navigation) {
	return function() {
		return navigation.openDrawer();
	};
}

function goHome(navigation) {
	return function() {
		return navigation.navigate('LandingUserScreen');
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

function goToSaveUserLocation(navigation) {
	return function() {
		return navigation.navigate('SaveCurrentLocationScreen');
	};
}

const landingUserScreenStack = createStackNavigator(
	{
		LandingUserScreen: {
			screen: LandingUserScreen,
			navigationOptions: ({ navigation }) => ({
				title: 'Locations',
				headerRight: buildIcon('location-arrow', headerButtons.btnRightStyle, 30, 'white', goToSaveUserLocation(navigation)),
				headerLeft: buildIcon('bars', headerButtons.btnLeftStyle, 30, 'white', openSideBar(navigation))
			})
		},
		DetailLocationScreen: {
			screen: DetailLocationScreen,
			navigationOptions: ({ navigation }) => ({
				title: 'Location on Map',
				headerRight: buildIcon('home', headerButtons.btnRightStyle, 30, 'white', goHome(navigation))
			})
		},
		SaveCurrentLocationScreen: {
			screen: SaveCurrentLocationScreen,
			navigationOptions: ({ navigation }) => ({
				title: 'Save Location',
				headerRight: buildIcon('home', headerButtons.btnRightStyle, 30, 'white', goHome(navigation))
			})
		}
	},
	{
		initialRouteName: 'LandingUserScreen', // Must be the same as the Route Name from above
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
				headerRight: buildIcon('home', headerButtons.btnRightStyle, 30, 'white', goHome(navigation)),
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
				drawerLabel: 'Locations', // side bar item name
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

export default createAppContainer(SideBar);

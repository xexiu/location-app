import React from 'react';
import { createStackNavigator, createAppContainer } from 'react-navigation';
import WelcomeGuestScreen from './WelcomeGuestScreen';

const RootStack = createStackNavigator(
	{
		WelcomeGuestScreen: {
			screen: WelcomeGuestScreen
		}
	},
	{
		initialRouteName: 'WelcomeGuestScreen', // Must be the same as the Route Name from above
		defaultNavigationOptions: {
			title: 'Welcome',
			headerStyle: {
				backgroundColor: '#f4511e'
			},
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

export default createAppContainer(RootStack);

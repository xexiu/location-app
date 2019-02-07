import React from 'react';
import { createStackNavigator, createAppContainer } from 'react-navigation';
import UserLandingScreen from '../users/UserLandingScreen';

const RootStack = createStackNavigator(
	{
		UserLandingScreen
	},
	{
		initialRouteName: 'UserLandingScreen', // Must be the same as the Route Name from above
		defaultNavigationOptions: {
			title: 'Locations',
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

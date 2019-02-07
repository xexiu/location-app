import React from 'react'; // eslint-disable-line
import { createStackNavigator, createAppContainer } from 'react-navigation';
import WelcomeGuestScreen from './WelcomeGuestScreen';
import LoginGuestScreen from './LoginGuestScreen';
import RegisterGuestScreen from './RegisterGuestScreen';

const RootStack = createStackNavigator(
	{
		WelcomeGuestScreen: {
			screen: WelcomeGuestScreen,
			navigationOptions: {
				header: null
			}
		},
		LoginGuestScreen: {
			screen: LoginGuestScreen,
			navigationOptions: {
				title: 'App Name'
			}
		},
		RegisterGuestScreen: {
			screen: RegisterGuestScreen,
			navigationOptions: {
				title: 'App Name'
			}
		}
	},
	{
		initialRouteName: 'WelcomeGuestScreen', // Must be the same as the Route Name from above
		defaultNavigationOptions: {
			title: '',
			headerTintColor: 'white',
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

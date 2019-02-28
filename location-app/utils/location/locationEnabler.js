import { Linking, Alert } from 'react-native';

/* eslint-disable no-console */
export function locationEnabler() {
	Alert.alert(
		'You need to enable location services.',
		'In order to use this App, please enable location!',
		[
			{
				text: 'Cancel',
				onPress: () => this.props.navigation.navigate('LandingUserScreen')
			},
			{ text: 'OK',
				onPress: () => Linking.openURL('app-settings:'),
				style: 'cancel'
			}
		],
		{ cancelable: false },
	);
}

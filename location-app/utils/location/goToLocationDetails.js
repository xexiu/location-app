import { NavigationActions } from 'react-navigation';
import * as firebase from 'firebase';

export function goToLocationDetail(location) {
	const navigateAction = NavigationActions.navigate({
		routeName: 'DetailLocationScreen',
		params: {
			location: location,
			user: firebase.auth()
		}
	});

	this.props.navigation.dispatch(navigateAction);
}

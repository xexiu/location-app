import { Keyboard } from 'react-native';

export function resetStateAndCloseKeyboard(states) {
	this.setState(states);
	Keyboard.dismiss();
}

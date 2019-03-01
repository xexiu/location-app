import React, { Component } from 'react';
import { View, Text, TextInput } from 'react-native';

/* eslint-disable class-methods-use-this */

export default class CategoriesUserScreen extends Component {
	constructor() {
		super();

		this.state = {
			errorMessage: '',
			inputTextCategory: ''
		};
	}

	handleTextInput(text) {
		if (/[a-zA-Z0-9]/.exec(text)) {
			this.setState({ errorMessage: '' });
			this.setState({ inputTextCategory: text });
		} else {
			this.setState({ errorMessage: 'Only letters and numbers allowed! ' });
		}
	}

	submitText() {
		console.log('TTTTTTT');

	}
	render() {
		const {
			inputTextCategory,
			errorMessage
		} = this.state;

		return (
			<View>
				<Text>Please add any wish Category:</Text>
				<Text>Maximum allowed characters are 20</Text>
				<Text>Special characters are now allowed. Only letters and numbers.</Text>
				<Text>${errorMessage}</Text>
				<TextInput
					value={inputTextCategory}
					onChangeText={this.handleTextInput.bind(this)}
					placeholder='Add a catergory'
					maxLength={20}
					onSubmitEditing={this.submitText.bind(this)}
				/>

				<Text>{inputTextCategory}</Text>
			</View>
		);
	}
}

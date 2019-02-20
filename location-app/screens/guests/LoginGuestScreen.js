import React, { Component } from 'react';
import { Card } from 'react-native-elements';
import { View, ScrollView } from 'react-native';
import t from 'tcomb-form-native';
import { formValidation } from '../../utils/common';
import { AppButton, BackgroundImage } from '../../components/common';
import { buttonsStyle } from '../../styles/index';
import { login } from '../../actions';

const Form = t.form.Form;

export default class LoginGuestScreen extends Component {
	constructor() {
		super();

		this.refForm = React.createRef();
		this.refToast = React.createRef();
		this.user = t.struct({
			email: formValidation.email,
			password: formValidation.password
		});
		this.options = {
			fields: {
				email: {
					help: 'Enter your email!',
					error: 'Incorrect email or bad format!',
					autoCapitalize: 'none'
				},
				password: {
					help: 'Enter your password',
					error: 'Bad password or not allowed!',
					password: true,
					secureTextEntry: true
				}
			}
		};
	}

	render() {
		return (
			<BackgroundImage source={require('../../../assets/images/backgroundApp.png')}>
				<ScrollView>
					<View>
						<Card wrapperStyle={{ paddingLeft: 10 }} title="Log In">
							<Form
								ref={this.refForm} // this.refs.form would be the reference
								type={this.user}
								options={this.options}
							/>

							<AppButton
								btnTitle="Login"
								btnStyle={buttonsStyle.buttonsLoginStyle}
								btnOnPress={login.bind(this)}
							/>
						</Card>
					</View>
				</ScrollView>
			</BackgroundImage>
		);
	}
}

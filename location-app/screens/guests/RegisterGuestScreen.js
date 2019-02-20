import React, { Component } from 'react';
import { Card } from 'react-native-elements';
import { View, ScrollView } from 'react-native';
import * as firebase from 'firebase';
import { formValidation } from '../../utils/common';
import { buttonsStyle } from '../../styles/index';
import { AppButton, BackgroundImage } from '../../components/common';
import Toast from 'react-native-easy-toast';
import t from 'tcomb-form-native';

/* eslint-disable camelcase, no-console */
const Form = t.form.Form;

export default class RegisterGuestScreen extends Component {
	constructor(props) {
		super(props);

		this.refForm = React.createRef();
		this.refToast = React.createRef();
		this.state = {
			user: {
				email: '',
				password: ''
			}
		};

		this.samePassword = t.refinement(t.String, (s) => s === this.state.user.password);
		this.user = t.struct({
			name: formValidation.name,
			email: formValidation.email,
			password: formValidation.password,
			password_confirmation: this.samePassword
		});

		this.options = {
			fields: {
				name: {
					help: 'Enter a nick name! 15 characters max',
					error: 'Bad characters. Allowed: Letters, numbers'
				},
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
				},

				password_confirmation: {
					help: 'Repeat your password ',
					error: 'The parameters doesn\'t match',
					password: true,
					secureTextEntry: true
				}
			}
		};

		this.validate = null;
	}

	onChange(user) {
		this.setState({ user });
		this.validate = this.refForm.current.getValue();
	}

	register() {
		if (this.validate) {
			firebase.auth().createUserWithEmailAndPassword(
				this.validate.email, this.validate.password
			).then(auth => {
				firebase.database().ref(`Users/${auth.user.uid}`).set({
					name: this.validate.name,
					email: this.validate.email,
					password: this.validate.password
				});
				console.log('User successfully registered!', auth);
			}).catch(error => {
				this.refToast.current.show(`${error}`, 5000);
			});
		}
	}

	render() {
		return (
			<BackgroundImage source={require('../../../assets/images/backgroundApp.png')}>
				<ScrollView>
					<View>
						<Card wrapperStyle={{ paddingLeft: 10 }} title="Register">
							<Form
								ref={this.refForm}
								type={this.user}
								options={this.options}
								onChange={(evt) => this.onChange(evt)}
								value={this.state.user}
							/>
							<AppButton
								btnTitle="Register"
								btnStyle={buttonsStyle.buttonsLoginStyle}
								btnOnPress={this.register.bind(this)}
							/>
						</Card>
						<Toast ref={this.refToast} />
					</View>
				</ScrollView>
			</BackgroundImage>
		);
	}
}

import React, { Component } from 'react';
import { View, Modal } from 'react-native';
import PropTypes from 'prop-types';

const styles = {
	overlay: {
		backgroundColor: 'rgba(31, 15, 12, 0.6)',
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center'
	}
};

export class CustomModal extends Component {
	render() {
		const { isVisible, children } = this.props;


		return (
			<Modal
				visible={isVisible}
				transparent={true}
				animationType="slide"
			>
				<View style={styles.overlay}>
					{children}
				</View>
			</Modal>
		);
	}
}

CustomModal.propTypes = {
	isVisible: PropTypes.bool,
	children: PropTypes.node
};

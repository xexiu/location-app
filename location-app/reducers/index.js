import { combineReducers } from 'redux';
import auth from './auth_reducer';
import locationUpdated from './location_reducer';

export default combineReducers({
	auth,
	locationUpdated
});

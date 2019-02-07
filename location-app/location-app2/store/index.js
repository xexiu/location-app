import { createStore, compose, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import reducers from '../reducers';

const store = createStore(
	reducers, // import all the reducers from the app reducers folder
	{}, // default state of the app
	compose(
		applyMiddleware(thunk)
	)
);

export default store;

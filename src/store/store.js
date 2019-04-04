import { createStore } from 'redux';
import simpleReducer from '../reducers/simpleReducer';
import {composeWithDevTools} from 'redux-devtools-extension';

export default function configureStore() {
	return createStore(simpleReducer,
		composeWithDevTools());
}

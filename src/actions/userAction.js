import { webRequest } from '../helpers/http';

// export const dbUrl = 'https://513cluster-qiybs.mongodb.net/';	
export const backendUrl = 'http://localhost:3001';	// run backend on this port

export const setEmail = email => {
	return { type: 'EMAIL', email };
};

export const setUser = (user) => {
	return { type: 'SET_USER', user };
};

export const authenticate = user => {
	return (dispatch) => {
		return webRequest()
			.post('/users/login', user)
			.then((response) => {
				console.log(response);
				let user = response.data;
				dispatch(setUser(user));
				store.set('user', user);
				return response.headers['x-auth'];
			})
			.catch(e => {
				if (e && e.response.data === 400) {
					console.error(e);
					throw 'invalid';
				}
			});
	};
};

// import axios from 'axios';

// export const baseUrl = 'https://513cluster-qiybs.mongodb.net/';

// export function webRequest() {
// 	return axios.create({
// 		baseURL: baseUrl,
// 		timeout: 4000,
// 		headers: {
// 			'x-auth': store.get('jwt')
// 		}
// 	});
// }



// export const setEmail = email => {
// 	return { type: 'EMAIL', email };
// };

// export const authenticate = user => {
// 	return (dispatch) => {
// 		return webRequest()
// 			.post('/users/login', user)
// 			.then((response) => {
// 				console.log(response);
// 				let user = response.data;
// 				dispatch(setUser(user));
// 				store.set('user', user);
// 				return response.headers['x-auth'];
// 			})
// 			.catch(e => {
// 				if (e && e.response.data === 400) {
// 					console.error(e);
// 					throw 'invalid';
// 				}
// 			});
// 	};
// };

import axios from 'axios';

// export const dbUrl = 'https://513cluster-qiybs.mongodb.net/';	
export const backendUrl = 'http://localhost:3001';

export function webRequest() {
	return axios.create({
		baseURL: backendUrl,
		timeout: 4000
	});
}

export default (state = { userType: ''}, action) => {
	switch (action.type) {
		case 'LOGIN_CHECK':
			return {
				userType: action.userType
			};
		default:
			return state;
	}
};


// action for setting email in redux store
export const setEmail = email => {
	return { type: 'EMAIL', email };
};


// action for setting user
export const setUser = (user) => {
	return { type: 'SET_USER', user };
};


// action for setting userType, username , email and avatar Id in redux store
export const authenticate = (userType, username, email, avatar) => {
	return {
		type: 'LOGIN_INFO',
		userType: userType,
		username: username,
		email: email,
		avatar: avatar
	};
};

// action for changing game state
export const changeGameState = (gameState) => {
	return {
		type: 'CHANGE_GAME_STATE',
		gameState: gameState
	};
};

// action for updating user list in redux store
export const updateUserList = (newList) => {
	return {
		type: 'UPDATE_USERLIST',
		userList: newList
	};
};

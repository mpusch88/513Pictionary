export const setEmail = email => {
	return { type: 'EMAIL', email };
};

export const setUser = (user) => {
	return { type: 'SET_USER', user };
};

export const authenticate = (userType, username, email) => {
	return {
		type: 'LOGIN_INFO',
		userType: userType,
		username: username,
		email: email
	};
};

export const changeGameState = (gameState) => {
	return {
		type: 'CHANGE_GAME_STATE',
		gameState: gameState
	};
};

export const updateUserList = (newPlayer) => {
	return {
		type: 'UPDATE_USERLIST',
		newPlayer: newPlayer
	};
}

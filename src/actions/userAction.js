export const setEmail = email => {
	return { type: 'EMAIL', email };
};

export const setUser = (user) => {
	return { type: 'SET_USER', user };
};

export const authenticate = (userType) => {
	return {
		type: 'LOGIN_CHECK',
		userType: userType,
	};
	// redo
};

export const changeGameState = (gameState) => {
	return {
		type: 'CHANGE_GAME_STATE',
		gameState: gameState
	};
}

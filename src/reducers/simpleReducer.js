const initState = {
	userType: 'fail',
	username: '',
	gameState: 'notReady',
	PlayerList: []
};

export default (state = initState, action) => {
	switch (action.type) {
		case 'LOGIN_CHECK':
			// return {userType: action.userType};
			return Object.assign({}, state, {
				userType: action.userType
			});
		case 'CHANGE_GAME_STATE':
			// return {gameState: action.gameState};
			return Object.assign({}, state, {
				gameState: action.gameState
			});
		default:
			return state;
	}
};

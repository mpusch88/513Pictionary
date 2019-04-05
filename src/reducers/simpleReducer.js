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
		case 'ADD_CURRENT_ROOM' :
			return Object.assign({}, state, {
				currentRoomId: action.currentRoomId,
				currentRoomName: action.currentRoomName,
				currentRoomCategory: action.currentRoomCategory
			});
		case 'SET_HOST':
			return Object.assign({}, state,{
				isCurrentRoomHost: action.isCurrentRoomHost,
			});
		default:
			return state;
	}
};

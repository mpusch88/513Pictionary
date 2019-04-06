export default (state = {}, action) => {
	switch (action.type) {
		case 'LOGIN_CHECK':
			return {
				userType: action.userType
			};
		case 'ADD_CURRENT_ROOM' :
			return Object.assign({}, state, {
				currentRoomId: action.currentRoomId,
				currentRoomName: action.currentRoomName,
				currentRoomCategory: action.currentRoomCategory
			});
		case 'REMOVE_CURRENT_ROOM' :
			return Object.assign({}, state, {
				currentRoomId: action.currentRoomId,
				currentRoomName: action.currentRoomName,
				currentRoomCategory: action.currentRoomCategory,
				isCurrentRoomHost: action.isCurrentRoomHost
			});
		case 'SET_HOST':
			return Object.assign({}, state,{
				isCurrentRoomHost: action.isCurrentRoomHost,
			});
		default:
			return state;
	}
};

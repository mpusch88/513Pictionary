//action for adding current room info to store
export const addRoomInfo = (room) => {
    return {
        type: 'ADD_CURRENT_ROOM',
        currentRoomId: room.id,
        currentRoomName: room.roomName,
        currentRoomCategory: room.roomCategory
    };

};


// action for removing current room
export const removeCurrentRoom = () => {
    return {
        type: 'REMOVE_CURRENT_ROOM',
        currentRoomId: "",
        currentRoomName: "",
        currentRoomCategory: "",
        isCurrentRoomHost: false
    }

};


//action for setting room host to store
export const setRoomHost = (isHost) => {
    return {
        type: 'SET_HOST',
        isCurrentRoomHost: isHost,
    };

};
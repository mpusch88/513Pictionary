export const addRoomInfo = (room) => {
    return {
        type: 'ADD_CURRENT_ROOM',
        currentRoomId: room.id,
        currentRoomName: room.roomName,
        currentRoomCategory: room.roomCategory
    }

};

export const removeCurrentRoom = () => {
    return {
        type: 'REMOVE_CURRENT_ROOM',
        currentRoomId: "",
        currentRoomName: "",
        currentRoomCategory: "",
        isCurrentRoomHost: false
    }

};

export const setRoomHost = (isHost) => {
    return {
        type: 'SET_HOST',
        isCurrentRoomHost: isHost,
    }

};
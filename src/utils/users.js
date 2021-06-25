const users = [];

const addUser = ({ id, username, room }) => {
    // Clean the data
    username = username.trim().toLowerCase();
    room = room.trim().toLowerCase();

    // Validate data 
    if (!username || !room) {
        return {
            error: 'A user and room should be provided!'
        }
    }
    // Checking for existing user 
    const existingUser = users.find(user => {
        return user.username === username && user.room === room
    });

    if (existingUser) {
        return {
            error: 'This username is already in use!'
        }
    }
    // Storing the user 
    const user = { id, username, room }
    users.push(user)
    return {
        user
    }
};

const removeUser = id => {
    const index = users.findIndex(user => user.id === id);

    if (index !== -1) {
        return users.splice(index, 1)[0];
    }
};

const getUser = id => {
    const user = users.find(user => user.id === id);
    return user;
};

const getUsersInRoom = room => {
    const inRoomUsers = users.filter(user => user.room === room);
    return inRoomUsers;
};

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}
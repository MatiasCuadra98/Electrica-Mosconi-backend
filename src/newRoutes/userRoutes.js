const {Router} = require('express');
const {getAllUsersHandler} = require('../handlers/User/getAllUserHandler');
const {getUserByIdHandler} = require('../handlers/User/getUserByIdHandler');
const {createUserHandler} = require('../handlers/User/createUserHandler');
const {updateUserHandler} = require('../handlers/User/updateUserHandler');
const {deleteUserHandler} = require('../handlers/User/deleteUserHandler');

const userRoute = Router();

userRoute.get('/', getAllUsersHandler);
userRoute.get('/:id', getUserByIdHandler);
userRoute.post('/', createUserHandler);
userRoute.put('/:id', updateUserHandler);
userRoute.delete('/delete/:id', deleteUserHandler);

module.exports = {userRoute};

// user id = "c38d0d67-aeab-478c-a044-6172798c71c6"
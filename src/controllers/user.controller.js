const userService = require('../services/user.service');
const userValidation = require('../utils/userValidation.util');

const insertUser = async (req, res) => {
    const checkUser = userValidation.userValidation(req.body);

    if (checkUser.type) {
        return res.status(checkUser.type).json({ message: checkUser.message });
    }

    const token = await userService.insertUser(checkUser);

    if (token.type) {
        return res.status(token.type).json({ message: token.message });
    }

    return res.status(201).json({ token });
};

const findAllUsers = async (_req, res) => {
    const usersList = await userService.findAllUsers();
    return res.status(200).json(usersList);
};

module.exports = {
    insertUser,
    findAllUsers,
};
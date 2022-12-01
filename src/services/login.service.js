const { User } = require('../models');
const { getToken } = require('../utils/jwtToken.util');

const insertLogin = async (email, password) => {
    const user = await User.findOne({
        where: {
            email,
            password,
        },
    });

    if (!user || user.password !== password) {
        return { type: 400, message: 'Invalid fields' };
    }

    const token = getToken(user);
    return token;
};

module.exports = { insertLogin };
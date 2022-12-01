const loginService = require('../services/login.service');
const loginValidate = require('../utils/loginValidation.util');

const insertLogin = async (req, res) => {
    const checkLogin = loginValidate.validateUser(req.body);
    if (checkLogin.type) {
        return res.status(checkLogin.type).json({ message: checkLogin.message });
    }

    const { email, password } = checkLogin;

    const token = await loginService.insertLogin(email, password);
    if (token.type) {
        return res.status(token.type).json({ message: token.message });
    }

    return res.status(200).json({ token });
};

module.exports = { insertLogin };
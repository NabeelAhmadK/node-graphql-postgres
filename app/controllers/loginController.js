const loginService = require('../services').loginService;
const loginController = {};

loginController.login = (req, res) => {
    loginService.login(req, res);
}

loginController.authenticationGaurd = (req, res) => {
    loginService.authenticationGaurd(req, res);
}

module.exports = loginController;
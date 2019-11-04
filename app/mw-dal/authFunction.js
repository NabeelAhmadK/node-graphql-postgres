const User = require('../../model').model.User;
const logger = require("../../logger/logger");
const dataUtils = require('../core-utils').DataUtils;

const loginUser = async (options) => {
    try {
        const response = await User.query(options.tranx).select()
            .where('user_name', options.user_name)
            .andWhere('deleted_flag', false);

        if (!response[0]) {
            throw {
                errPhrase: 'Invalid UserName'
            };
        }

        const validatePassword = await dataUtils.validateHash(response[0].user_password, options.password);

        if (!validatePassword) {
            throw {
                errPhrase: 'Invalid Password'
            }
        }
        delete response[0].user_password;
        let responseObj = response[0];
        return responseObj;

    } catch (err) {
        throw err;
    }
}

module.exports.loginUser = loginUser;
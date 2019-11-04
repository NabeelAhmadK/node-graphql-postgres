const path = require('path');
const {
    Model
} = require('../index');

/* eslint-disable require-jsdoc, max-len */

/**
 * emp.user
 * 
 * @param {string}               [user_code]          - 
 * @param {string}               [user_name]          - 
 * @param {string}               [user_password]      - 
 * @param {string}               [title]              - 
 * @param {string}               [first_name]         - 
 * @param {string}               [middle_name]        - 
 * @param {string}               [last_name]          - 
 * @param {string}               [direct_phone]       - 
 * @param {string}               [mobile_phone]       - 
 * @param {string}               [skype]              - 
 * @param {string}               [corporate_email]    - 
 * @param {string}               [personal_email]     - 
 * @param {string}               [bio_description]    - 
 * @param {string}               [user_status_id]     - 
 * @param {string}               [user_type_id]       - 
 * @param {number}               [user_dept_id]       - 
 * @param {boolean}              is_admin             - 
 * @param {number}               [role_id]            - 
 * @param {boolean}              [deleted_flag]       - 
 * @param {number}               [service_provider_id] - 
 * @param {string}               [last_login_date]    - 
 * @param {number}               [login_count]        - 
 * @param {number}               [failed_attempts]    - 
 * @param {string}               create_date          - 
 * @param {string}               [create_by]          - 
 * @param {string}               mod_date             - 
 * @param {string}               [mod_by]             - 
 * @param {number}               [user_profile_id]    - 
 */
class User extends Model {
    static get tableName() {
        return 'emp.user';
    }

    static get idColumn() {
        return 'user_id';
    }

    static get relationMappings() {
        return {}
    }

    static get jsonSchema() {
        return {
            title: 'user',
            description: null,
            type: 'object',
            additionalProperties: false,
            properties: {
                user_code: {
                    type: 'string',
                    maxLength: 50
                },
                user_name: {
                    type: 'string',
                    maxLength: 64
                },
                user_password: {
                    type: 'string',
                    maxLength: 200
                },
                title: {
                    type: 'string',
                    maxLength: 5
                },
                first_name: {
                    type: 'string',
                    maxLength: 100
                },
                middle_name: {
                    type: 'string',
                    maxLength: 100
                },
                last_name: {
                    type: 'string',
                    maxLength: 100
                },
                direct_phone: {
                    type: 'string',
                    maxLength: 12
                },
                mobile_phone: {
                    type: 'string',
                    maxLength: 12
                },
                skype: {
                    type: 'string',
                    maxLength: 100
                },
                corporate_email: {
                    type: 'string',
                    maxLength: 100
                },
                personal_email: {
                    type: 'string',
                    maxLength: 100
                },
                bio_description: {
                    type: 'string',
                    maxLength: 200
                },
                user_status_id: {
                    type: 'string',
                    maxLength: 2
                },
                user_type_id: {
                    type: 'string',
                    maxLength: 2
                },
                user_dept_id: {
                    type: 'integer',
                    minimum: -9223372036854776000,
                    maximum: 9223372036854776000
                },
                is_admin: {
                    type: 'boolean'
                },
                role_id: {
                    type: 'integer',
                    minimum: -2147483648,
                    maximum: 2147483647
                },
                deleted_flag: {
                    type: 'boolean'
                },
                service_provider_id: {
                    type: 'integer',
                    minimum: -9223372036854776000,
                    maximum: 9223372036854776000
                },
                last_login_date: {
                    type: 'string',
                    format: 'date-time'
                },
                login_count: {
                    type: 'integer',
                    minimum: -32768,
                    maximum: 32767
                },
                failed_attempts: {
                    type: 'integer',
                    minimum: -32768,
                    maximum: 32767
                },
                create_date: {
                    type: 'string',
                    format: 'date-time'
                },
                create_by: {
                    type: 'string',
                    maxLength: 45
                },
                mod_date: {
                    type: 'string',
                    format: 'date-time'
                },
                mod_by: {
                    type: 'string',
                    maxLength: 45
                },
                user_profile_id: {
                    type: 'integer',
                    minimum: -9223372036854776000,
                    maximum: 9223372036854776000
                }
            },
            required: []
        };
    }
}

module.exports = User;
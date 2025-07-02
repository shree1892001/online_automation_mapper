const CallJavaApiService = require('./CallJavaApiService');
const config = require('../config');



class AuthenticationService extends CallJavaApiService {
    constructor() {
        super();
    }
    async get_authentication_token(){
        const username = `${config.sign_in_username}`;
        const password = `${config.sign_in_password}`;
        const apiDetails = {
            "endpoint": "/authentication/api/user/signin",
            "payload": {
                "username": username,
                "password": password,
                "latDetails": "sadadasd",
                "longDetails": "asdasd",
                "ipAddress": "asadad"
            },
            "type": "post",
            "auth": null
        };
        try {
            const response = await this.calljavaApi(apiDetails,'post');
            return response; // Return the response for further use
        } catch (error) {
            console.error("Error getting authentication token:", error.message);
            throw error; // Re-throw the error for the caller to handle
        }
    }
}

module.exports = AuthenticationService;



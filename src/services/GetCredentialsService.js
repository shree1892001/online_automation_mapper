const CallJavaApiService = require('../services/CallJavaApiService');
const AuthenticationService = require('../services/AuthenticationService');


class GetCredentialsService extends CallJavaApiService {
    constructor() {
        super();
    }
    async get_username_and_password(){
        const getApiDetails =(keyName, token) => ({
                "endpoint": `/contact/api/config/getByKeyName/${keyName}`,
                "payload": null,
                "type": "get",
                "auth": token
                });
        const authService = new AuthenticationService();
        const tokenResponse = await authService.get_authentication_token();
        const getusername = getApiDetails("QuickbooksUsername", tokenResponse.token);
        const getpassword = getApiDetails("QuickbooksPassword", tokenResponse.token);
        const getaccesstoken = getApiDetails("QuickbooksToken", tokenResponse.token);
        const getrefreshtoken = getApiDetails("QuickbooksRefreshToken", tokenResponse.token);
        const getemailusername = getApiDetails("UserName", tokenResponse.token);
        const getemailpassword = getApiDetails("UserPassword", tokenResponse.token);
        try {
            const username = await this.calljavaApi(getusername,'post');
            const password = await this.calljavaApi(getpassword,'post');
            const accesstoken = await this.calljavaApi(getaccesstoken,'post');
            const refreshtoken = await this.calljavaApi(getrefreshtoken,'post');
            const emailusername = await this.calljavaApi(getusername,'post');
            const emailpassword = await this.calljavaApi(getpassword,'post');
            const user = username.value
            const pass = password.value
            const accessT = accesstoken
            const refreshT = refreshtoken
            const eUser = emailusername.value
            const ePass = emailpassword.value
            return {user, pass, accessT, refreshT,eUser,ePass};
        } catch (error) {
            console.error("Error getting authentication token:", error.message);
            throw error; // Re-throw the error for the caller to handle
        }
    }
            }

module.exports = GetCredentialsService;



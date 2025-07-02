const config = {
    baseUrl: process.env.BASE_URL || "http://api.redberyltest.in/decrypt",
    sign_in_username: process.env.SIGN_IN || "santosh@redberyltech.com",
    sign_in_password: process.env.SIGN_IN_PASS || "Santosh@123",
    get_otp:process.env.GET_OTP || "http://chatbot.redberyltest.in:9500/get-email"
};

module.exports = config;
const TokenHandler = require('../handlers/TokenHandler');
const logger = require('../utils/logger');
const { handleError } = require('../utils/errorHandler');

exports.generateTokenProcess = async (page) => {
    try {
        logger.info('Processing token generation');
        const tokenHandler = new TokenHandler();
        const { refreshtoken, accesstoken } = await tokenHandler.handle_token(page);
        return { refreshtoken, accesstoken }
    } catch (error) {
        console.log('Error occurred during token generation', error);
        handleError(error);
        throw error;
    }
};


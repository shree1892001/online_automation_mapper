const formService = require('../services/formService');
const tokenService = require('../services/tokenService');
const { handleError } = require('../utils/errorHandler');
const logger = require('../utils/logger'); 

// Submit Form Function
exports.submitForm = async (page, jsonData) => {
    try {
        logger.info('Received form submission request', { payload: jsonData });
        const result = await formService.processForm(page, jsonData);
        logger.info('Form submission succeeded');
        return result;
    } catch (error) {
        logger.error('Error during form submission', error);
        throw error; // rethrow so it can be caught by the caller
    } finally {
        logger.info('Form submission process completed.');
    }
};

// Generate Token Function
exports.generateToken = async (page) => {
    try {
        const { refreshtoken, accesstoken } = await tokenService.generateTokenProcess(page);
        logger.info('Token generated successfully');
        return { refreshtoken, accesstoken };
    } catch (error) {
        logger.error('Error processing token generation', error);
        console.log('Error processing token generation', error);
        handleError(error);
        throw error;
    }
};

const puppeteer = require('puppeteer');
const stateFormFactory = require('../factories/stateFormFactory.js');
const logger = require('../utils/logger.js');

exports.processForm = async (page, jsonData) => {
    try {
        // Validate input data
        if (!jsonData || typeof jsonData !== 'object') {
            throw new Error('Invalid input data: jsonData must be an object');
        }

        const firstKey = Object.keys(jsonData)[0];
        if (!firstKey) {
            throw new Error('Invalid input data: No data found in jsonData');
        }

        const data = jsonData[firstKey];
        logger.info('Processing data:', { data });

        if (!data) {
            throw new Error('Invalid input data: No data found in first key');
        }

        if (!data.State) {
            throw new Error('Invalid input data: State information is missing');
        }

        if (!data.orderType) {
            throw new Error('Invalid input data: orderType is missing');
        }

        if (!data.payload) {
            throw new Error('Invalid input data: payload is missing');
        }

        logger.info(`Processing form for state: ${data.State.stateFullDesc}`);

        // Pass the entire jsonData object to maintain the structure
        const formHandler = await stateFormFactory.getFormHandler(page, jsonData);
        if (formHandler) {
            try {
                const result = await formHandler();
                return result;
            } catch (error) {
                logger.error(`Error occurred while filling form: ${error.message}`);
                throw new Error(`Form filling failed: ${error.message}`);
            }
        } else {
            logger.warn('No form handler returned');
            throw new Error('Form handler not found');
        }
    } catch (error) {
        logger.error(`Error processing form: ${error.message}`);
        throw error;
    }
};




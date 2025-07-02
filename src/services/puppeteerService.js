const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const logger = require('../utils/logger'); // Import your logger
const stateFormFactory = require('../factories/stateFormFactory'); // Import the state form factory

puppeteer.use(StealthPlugin());

async function runPuppeteerScript(jsonData) {
    let browser;
    try {
        logger.info('Starting Puppeteer...');

        browser = await puppeteer.launch({
            headless: false,
            args: [
                '--start-maximized',
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-infobars',
                '--ignore-certificate-errors',
                '--ignore-certificate-errors-spki-list',
                '--disable-blink-features=AutomationControlled',
                '--disable-notifications'
            ],
            ignoreHTTPSErrors: true,
            slowMo: 50
        });

        const page = await browser.newPage();

        // Adjust viewport
        await page.setViewport({ width: 1920, height: 1080 });

        // Get the form handler based on state
        const formHandler = stateFormFactory.getFormHandler(page, jsonData);
        if (!formHandler) {
            throw new Error(`No form handler available for state: ${jsonData.State.stateFullDesc}`);
        }

        // Execute the form handler's fill form logic
        await formHandler.fillForm(jsonData);

        logger.info('Form submission successful!');
    } catch (error) {
        logger.error('Error running Puppeteer script:', error.message);
        throw error;
    } finally {
        if (browser) {
            await browser.close();
        }
    }
}

module.exports = { runPuppeteerScript };

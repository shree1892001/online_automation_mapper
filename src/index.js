const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const formController = require('./controllers/formController'); // Ensure path is correct
const logger = require('./utils/logger'); // Ensure path is correct

const app = express();
const port = process.env.PORT || 3003; // You can set this to 6000 if needed

// Middleware setup
app.use(bodyParser.json());
app.use(cors({
    origin: [
        'chrome-extension://kpmpcomcmochjklgamghkddpaenjojhl',
        'https://www.redberyltest.in',
        'https://www.thesourcecode.in',
        'http://64.202.187.199:3000'
    ],
    methods: ['GET', 'POST']
}));

// User-Agent mapping for different websites
const userAgents = {
    'example1.com': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    'example2.com': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Safari/605.1.15',
    'example3.com': 'Mozilla/5.0 (Windows NT 6.1; WOW64; rv:60.0) Gecko/20100101 Firefox/60.0',
    'example4.com': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.81 Safari/537.36',
    'example5.com': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.159 Safari/537.36',
    'default': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.82 Safari/537.36'
};

// Puppeteer script logic for generating tokens
async function runPuppeteerScriptForToken(req,res) {
    const puppeteer = require('puppeteer'); // No stealth plugin needed
    let browser;
    try {
        // const jsonData = req.body;

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
                '--disable-notifications',
                '--disable-web-security'
            ],
            ignoreHTTPSErrors: true,
            slowMo:50
        });

        const page = await browser.newPage();
        await page.setViewport({ width: 1600, height: 950 }); // Set browser size

        const { refreshtoken, accesstoken } = await formController.generateToken(page);
        res.status(200).json({
            'refreshToken': refreshtoken.trim(),
            'accessToken': accesstoken.trim()
        });

    } catch (error) {
        logger.error('Puppeteer script execution failed', error);
        res.status(500).send({ message: "Something went wrong" });
    } finally {
        if (browser) await browser.close(); // Close browser if it was opened
    }
}

// Puppeteer script logic for running a form submission
async function runPuppeteerScript(req, res) {
    const puppeteer = require('puppeteer-extra');
    const StealthPlugin = require('puppeteer-extra-plugin-stealth');
    puppeteer.use(StealthPlugin());

    let browser;
    try {
        const  jsonData = req.body;
        console.log(jsonData);
       
        const websiteUrl = Object.values(jsonData)[0]?.State?.stateUrl|| 'default';
        const hostname = new URL(websiteUrl).hostname;
        const userAgent = userAgents[hostname] || userAgents['default'];

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
                '--disable-notifications',
            ],
            ignoreHTTPSErrors: true,
            slowMo: 20
        });

        const page = await browser.newPage();
        await page.setUserAgent(userAgent);

        const result = await formController.submitForm(page, jsonData);  // No need to pass `res` to `submitForm`
        res.status(200).send({ message: result });
    } catch (error) {
        logger.error('Error during Puppeteer script execution: ' + error.message, error);
        res.status(500).send({ message: "Something went wrong" });
    }
}

// Routes
app.post('/run-puppeteer', async (req, res) => {
    if (!req.body || !Object.keys(req.body)[0] || !req.body[Object.keys(req.body)[0]].State || !req.body[Object.keys(req.body)[0]].State.stateUrl) {
        return res.status(400).send({ error: 'Invalid input data' });
    }
    await runPuppeteerScript(req, res);
});

app.post('/generate-token', async (req,res) => {
    await runPuppeteerScriptForToken(req,res);
});

// Start the server
app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});

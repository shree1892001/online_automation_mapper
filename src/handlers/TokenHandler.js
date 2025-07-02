const BaseFormHandler = require('./BaseFormHandler');
const axios = require('axios');
const logger = require('../utils/logger');
const GetCredentialsService = require('../services/GetCredentialsService'); 
const CallJavaApiService = require('../services/CallJavaApiService');
const config = require('../config');




class TokenHandler extends BaseFormHandler {
    constructor() {
        super();
    }

    async handle_token(page) {
        try {
            logger.info('Processing token with provided data');
            const url = "https://accounts.intuit.com/app/sign-in?app_group=ExternalDeveloperPortal&asset_alias=Intuit.devx.devx&redirect_uri=https%3A%2F%2Fdeveloper.intuit.com%2Fapp%2Fdeveloper%2Fplayground%3Fcode%3DAB11727954854bIo1ROpRDYcmv1obOf0mpd0Hrei8JYX1HtMvS%26state%3DPlaygroundAuth%26realmId%3D9341453172471531&single_sign_on=false&partner_uid_button=google&appfabric=true"
            const authService = new GetCredentialsService();
            const {user, pass, accessT, refreshT,eUser,ePass} = await authService.get_username_and_password();
            // const email =  jsonData.email
            // const password =  jsonData.password
            const email = user
            const password = pass 
            await this.navigateToPagetoken(page,url)
            await page.waitForSelector('input[name="Email or user ID"]',{timeout:0});
            await this.fillInputByName(page,'Email or user ID',email)
            await this.fillInputByName(page,'Password',password)
            await this.clickButton(page, 'span.Button-label-f10bb25');        
            // verification code
            await page.waitForSelector('button',{timeout:0});
            const buttons = await page.$$eval('button', buttonElements => {
                return buttonElements.map(button => button.innerText.trim());
            });
            const emailButtonIndex = buttons.findIndex(buttonText => buttonText.startsWith('Email a code'));
            if (emailButtonIndex !== -1) {
                // Click the button that matches the text
                const buttonHandles = await page.$$('button'); // Get button elements
                if (buttonHandles[emailButtonIndex]) {
                    await buttonHandles[emailButtonIndex].click();
                    console.log('Button clicked: Email a code');
                    await this.waitForTimeout(3000)
                    const call_email = `${config.get_otp}`;
                    const response = await axios.post(call_email, { 
                        subject: 'Your Intuit code',username:eUser, password:ePass
                    });                        

                    await this.fillInputByName(page,'Verification code',response.data)
                    await page.click('button[data-testid="VerifyOtpSubmitButton"]');
                }
            }
            else{
                console.log("Email code button not found");
            }
            await page.waitForSelector('[data-automation-id="ModalDialog--container"]', { visible: true ,timeout: 0});
            console.log("Modal is fully loaded and visible.");
            await page.evaluate(() => {
                const mfaWindow = document.querySelector('.MfaChallengePicker__StyledWrapper-n173ye-0');
                if (mfaWindow) {
                    mfaWindow.style.display = 'none';  // Hide the MFA window
                    console.log('MFA window bypassed.');
                }
            });
            const closeButtonSelector = 'button[aria-label="Close"]';
            await this.clickButton(page, closeButtonSelector);
            console.log('Close button clicked successfully.');
            await page.click('#playgroundAppSelect');

            // Wait for the dropdown menu to appear
            await page.waitForSelector('[role="listbox"]');
        
            // Select the "RedBeryl" option
            await page.evaluate(() => {
                let items = document.querySelectorAll('[role="option"]'); // Get all options
                items.forEach(item => {
                    if (item.innerText.includes('RedBeryl')) {
                        item.click(); // Click the desired option
                    }
                });
            });
            // await this.selectDropdownOptionByPlaceholder(page, 'Please select workspace from the list');
            await this.selectDropdownOptionByPlaceholder(page, 'Please select app from all your apps');
            await this.selectCheckboxByValue(page, 'com.intuit.quickbooks.accounting');
            await this.selectCheckboxByValue(page, 'com.intuit.quickbooks.payment');
            const buttonText = 'Get authorization code';

            await page.evaluate((text) => {
                const button = Array.from(document.querySelectorAll('button')).find(
                    btn => btn.textContent.trim() === text
                );
                if (button) {
                    button.click();
                }
            }, buttonText);
            // const dropdownSelector = 'svg.DropdownTypeahead-chevronIconWrapper-6ae99f6';
            // const dropdown = await page.$(dropdownSelector);

            // if (dropdown) {
            //     // Dropdown exists, proceed to click it
            //     await dropdown.click();

            //     // Wait for the options to appear
            //     const companySelector = 'div[title="Sandbox Company_US_2"]';
            //     await page.waitForSelector(companySelector);

            //     // Click the desired company
            //     await page.click(companySelector);

            //     // Proceed to click the "Next" button
            //     const nextButtonSelector = 'button.btn-next';
            //     await page.waitForSelector(nextButtonSelector);
            //     await page.click(nextButtonSelector);
            // };
            await page.waitForSelector('.step-detail',{timeout:0});
            await page.evaluate(() => {
                const buttons = Array.from(document.querySelectorAll('button.idsTSButton'));
                const button = buttons.find(btn => btn.textContent.trim() === 'Get tokens');
                if (button) {
                    button.click();
                } else {
                    console.log('Button not found');
                }
            });
        
            await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
            await page.waitForSelector('#idsTxtField22',{timeout:0});
            const refreshtoken = await this.getInputValueById(page, 'idsTxtField22');
            await page.waitForSelector('#idsTxtField23',{timeout:0});
            const accesstoken = await this.getInputValueById(page, 'idsTxtField23');
            console.log("Input Value:", refreshtoken);
            console.log("Input Value:", accesstoken);
            return { refreshtoken, accesstoken }
        } catch (error) {
            logger.error('Error during generate new access and refresh token:', error.stack);
            throw new Error(`Error during generate new access and refresh token: ${error.message}`);
        }
 
    }
}

module.exports = TokenHandler;
const BaseFormHandler = require('../handlers/BaseFormHandler');
const logger = require('../utils/logger');
const { fetchByState } = require('../utils/getByState');
const fs = require('fs');


class VermontForLLC extends BaseFormHandler {
    constructor() {
        super();
    }

    async VermontForLLC(page, jsonData,payload){
        logger.info('Navigating to Vermont form submission page...');
        const data = Object.values(jsonData)[0];

            const url = data.State.stateUrl;;
        await this.navigateToPage(page, url);
        await this.fillInputByName(page, 'userId', data.State.filingWebsiteUsername);
        await page.evaluate(selector => Array.from(document.querySelectorAll(selector)).find(btn => btn.textContent.trim() === 'Continue')?.click(), 'button.login-form-button');
        await this.fillInputByName(page, 'password ', data.State.filingWebsiteUsername);
        await this.waitForTimeout(9000)
        await this.clickElementByTextForSpan(page,'span.mdc-button__label','Get Authentication Code')
        const resp = await this.getEmailCode('Business Services Division - Login Authentication Code')
        console.log("Response python::",resp)
        for (let i = 0; i < 6; i++) {
            const otpSelector = `.otp-input:nth-of-type(${i + 1})`; 
            const otpDigit = resp[i]; 
            await page.type(otpSelector, otpDigit, { delay: 100 }); 
            }
        await this.clickElementByTextForSpan(page,'span.mdc-button__label','Authenticate')
        await page.waitForFunction(
            url => window.location.href === url,
            { timeout: 30000 },
            'https://bizfilings.vermont.gov/dashboard'
        );
        await this.waitForTimeout(1000)
        await this.clickElementByTextForSpan(page,'span.mdc-list-item__content span.mat-mdc-list-item-unscoped-content','Filings')
        await this.clickElementByTextForSpan(page,'app-nav-list-item mat-list-item span.mat-mdc-list-item-unscoped-content','Business')
        await this.waitForTimeout(5000)
        await page.evaluate(() => {
            const cards = Array.from(document.querySelectorAll('mat-card'));
            const targetCard = cards.find(card => card.textContent.trim().includes('Initial Filing'));
            targetCard?.click();
        });
        await this.selectRadioButtonById(page, 'mat-radio-2-input');
        await this.waitForTimeout(5000)
        await this.clickElementByTextForSpan(page, 'button.mdc-button', 'Next');
        await this.selectRadioButtonById(page,'mat-radio-6');
        await this.waitForTimeout(5000)
        await this.clickElementByTextForSpan(page,'button.mdc-button','Next');
        await page.waitForSelector('input[name="BusinessName"]', { visible: true });
        await this.waitForTimeout(8000)
        await this.fillInputByName(page,'BusinessName', payload.Name.Legal_Name);
        await this.clickElementByTextForSpan(page, 'span.mdc-button__label', 'Check Availability', true);
        await this.waitForTimeout(5000)
        await this.clickElementByTextForSpan(page,'button.mdc-button','Next');
        if (await this.clickOkButtonIfExists(page)) {
            if (await this.clickOkButtonIfExists(page)) {
                console.log("Ok button was clicked.");
                await this.clickElementByTextForSpan(page,'button.mdc-button','Next');}
          } else {
            console.log("Ok button was not found on the page.");
          }
        const inputData = [
            { selector: '#mat-input-6', value: payload.Naics_Code.NC_NAICS_Code}
        ];
        await this.waitForTimeout(3000)
        await this.fillInputbyid(page, inputData);
        await page.keyboard.press('Enter');
        await this.waitForTimeout(5000)
        await this.clickElementByTextForSpan(page,'button.mdc-button','Next');
        if (await this.clickOkButtonIfExists(page)) {
            if (await this.clickOkButtonIfExists(page)) {
                console.log("Ok button was clicked.");
                await this.clickElementByTextForSpan(page,'button.mdc-button','Next');}
          } else {
            console.log("Ok button was not found on the page.");
          }
        await this.waitForTimeout(3000)
        await this.fillInputByPlaceholder(page, 'Type here to search for the Address', payload.Principal_Address.Street_Address);
        await this.waitForTimeout(1000)
        await page.evaluate((state) => {
            const items = Array.from(document.querySelectorAll('.mat-mdc-select-value-text span'));
            const item = items.find((el) => el.textContent.trim() === state);
            if (item) item.click();
          }, payload.Principal_Address.State);
        await this.fillInputByPlaceholder(page, 'Enter City', payload.Principal_Address.City);
        await this.fillInputByPlaceholder(page, 'Enter Zip5', payload.Principal_Address.Zip_Code);
        await this.waitForTimeout(5000)
        await this.clickElementByTextForSpan(page,'button.mdc-button','Next');
        if (await this.clickOkButtonIfExists(page)) {
            if (await this.clickOkButtonIfExists(page)) {
                console.log("Ok button was clicked.");
                await this.clickElementByTextForSpan(page,'button.mdc-button','Next');}
          } else {
            console.log("Ok button was not found on the page.");
          }
        // Register agent
        await page.evaluate(() => {
            document.querySelector('label[for="mat-radio-21-input"]').click();
          });
        const rafullname = payload.Registered_Agent.keyPersonnelName;
        const [firstName, lastName] = await this.ra_split(rafullname)
        await this.fillInputByPlaceholder(page, 'Enter First Name', firstName);
        await this.fillInputByPlaceholder(page, 'Enter Last Name', lastName);
        await this.fillInputByPlaceholder(page, 'Enter Email ', payload.Registered_Agent.EmailId);
        // Street Address
        await page.locator('.mat-mdc-autocomplete-trigger.mat-mdc-input-element.ng-tns-c1205077789-53').fill(payload.Registered_Agent.Address.Street_Address);
        await page.locator('.mat-mdc-input-element.ng-tns-c1205077789-56 ').fill(payload.Registered_Agent.Address.City);
        await page.locator('.mat-mdc-input-element.ng-tns-c1205077789-71').fill(payload.Registered_Agent.Address.Zip_Code);

        // Mailing Address
        await page.locator('.mat-mdc-autocomplete-trigger.mat-mdc-input-element.ng-tns-c1205077789-59').fill(payload.Registered_Agent.Mailing_Information.Street_Address);
        await page.locator('.mat-mdc-input-element.ng-tns-c1205077789-62').fill(payload.Registered_Agent.Mailing_Information.City);
        await page.locator('.mat-mdc-input-element.ng-tns-c1205077789-75').fill(payload.Registered_Agent.Mailing_Information.Zip_Code);
        await this.clickElementByTextForSpan(page,'span.mdc-button__label','Save Agent for Service of Process');
        
        await page.click('#mat-mdc-checkbox-18-input');
        await this.waitForTimeout(5000)
        await this.clickElementByTextForSpan(page,'button.mdc-button','Next');
        await this.waitForTimeout(5000)
        await this.clickElementByTextForSpan(page,'button.mdc-button','Next');
        // add organizer
        await this.clickElementByTextForSpan(page, 'button span.mdc-button__label', 'Add Organizer');
        const orgfullname = payload.Organizer_Information.keyPersonnelName;
        const [fName, lName] = await this.ra_split(orgfullname)
        await this.fillInputByPlaceholder(page, 'Enter First Name', fName);
        await this.fillInputByPlaceholder(page, 'Enter Last Name', lName);
        await page.locator('.mat-mdc-autocomplete-trigger.mat-mdc-input-element.ng-tns-c1205077789-78').fill(payload.Organizer_Information.Address.Street_Address);
        await this.waitForTimeout(5000)
        await page.locator('.mat-mdc-input-element.ng-tns-c1205077789-81').fill(payload.Organizer_Information.Address.City);
        await this.waitForTimeout(3000)
        await page.locator('.mat-mdc-input-element.ng-tns-c1205077789-100').fill(payload.Organizer_Information.Address.Zip_Code);
        await this.clickElementByTextForSpan(page,'span.mdc-button__label',' Save Organizer ');
        await this.waitForTimeout(5000)
        await this.clickElementByTextForSpan(page,'button.mdc-button','Next');
        await this.waitForTimeout(5000)
        await this.clickElementByTextForSpan(page,'button.mdc-button','Next');

            } catch (error) {
                    logger.error(`Failed to navigate to the form page: ${error.message}`);
            }
        }

  
module.exports = VermontForLLC;

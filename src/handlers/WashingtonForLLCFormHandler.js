const BaseFormHandler = require('../handlers/BaseFormHandler');
const logger = require('../utils/logger');
const mappingService = require('../services/mappingService');

class WashingtonForLLC extends BaseFormHandler {
    constructor() {
        super();
    }

    async WashingtonForLLC(page, jsonData, payload) {
        try {
        logger.info('Navigating to Washington form submission page...');
            
            // Debug: Log original payload structure
            logger.info('Original payload structure:', JSON.stringify(payload, null, 2));
            
            // Map the payload keys using database-driven mapping
            const mappedPayload = await mappingService.mapPayloadKeys(payload, 'llc');
            
            // Debug: Log mapped payload structure
            logger.info('Mapped payload structure:', JSON.stringify(mappedPayload, null, 2));
            
        const data = Object.values(jsonData)[0];
            const url = data.State.stateUrl;
        await this.navigateToPage(page, url);
        await this.fillInputByName(page, 'Username', data.State.filingWebsiteUsername);
        await this.fillInputByName(page, 'Password', data.State.filingWebsitePassword);

        await page.click('button.btn.btn-default.btn-lg.button_bg');

        await page.waitForSelector('span.txt', { visible: true });
        await page.evaluate(() => {
            const elements = Array.from(document.querySelectorAll('span.txt'));
            const targetElement = elements.find(el => el.textContent.trim() === 'Create or Register a Business');
            if (targetElement) {
                targetElement.click();
            }
        });

        await new Promise(resolve => setTimeout(resolve, 4000))
        await page.waitForSelector('#rdoDomestic');
        await page.click('#rdoDomestic');

        await new Promise(resolve => setTimeout(resolve, 5000))
        await this.clickDropdown(page, '#BusinessEntityType', 'WA LIMITED LIABILITY COMPANY');

        // Wait for the button with the class 'btn btn-success btn-md' and click it
        await page.waitForSelector('input.btn.btn-success.btn-md', { visible: true });
        await page.click('input.btn.btn-success.btn-md');
        
        await new Promise(resolve => setTimeout(resolve, 5000))
            
            // Get business name with multiple fallback paths
            const legalName = mappingService.getValueFromPath(mappedPayload, [
                'Legal_Name',
                'Name.Legal_Name',
                'Name.CD_LLC_Name'
            ]) || mappingService.getValueFromPath(payload, [
                'Name.Legal_Name',
                'Name.CD_LLC_Name',
                'Legal_Name'
            ]);
            
            if (!legalName) {
                throw new Error('Business name not found in payload. Available keys: ' + JSON.stringify(Object.keys(mappedPayload)));
            }
            
            await this.fillInputByName(page, 'txtBusiessName', legalName);
        await page.waitForSelector('input.btn.btn-md.btn-brown', { visible: true });
        await page.click('input.btn.btn-md.btn-brown');
        await this.waitForTimeout(7000)
        
            // Get registered agent information with fallbacks
            const raName = mappingService.getValueFromPath(mappedPayload, [
                'Registered_Agent.keyPersonnelName',
                'Registered_Agent.RA_Name'
            ]) || mappingService.getValueFromPath(payload, [
                'Registered_Agent.keyPersonnelName',
                'Registered_Agent.RA_Name'
            ]);
            
            const raEmail = mappingService.getValueFromPath(mappedPayload, [
                'Registered_Agent.EmailId',
                'Registered_Agent.CI_Email_Address'
            ]) || mappingService.getValueFromPath(payload, [
                'Registered_Agent.EmailId',
                'Registered_Agent.CI_Email_Address'
            ]);
            
            const raAddress = mappingService.getValueFromPath(mappedPayload, [
                'Registered_Agent.Address.Street_Address',
                'Registered_Agent.Address.RA_Address_Line_1'
            ]) || mappingService.getValueFromPath(payload, [
                'Registered_Agent.Address.Street_Address',
                'Registered_Agent.Address.RA_Address_Line_1'
            ]);
            
            const raAddress2 = mappingService.getValueFromPath(mappedPayload, [
                'Registered_Agent.Address.Address_Line_2',
                'Registered_Agent.Address.RA_Address_Line_2'
            ]) || mappingService.getValueFromPath(payload, [
                'Registered_Agent.Address.Address_Line_2',
                'Registered_Agent.Address.RA_Address_Line_2'
            ]) || " ";
            
            const raZipCode = mappingService.getValueFromPath(mappedPayload, [
                'Registered_Agent.Address.Zip_Code',
                'Registered_Agent.Address.RA_Zip_Code'
            ]) || mappingService.getValueFromPath(payload, [
                'Registered_Agent.Address.Zip_Code',
                'Registered_Agent.Address.RA_Zip_Code'
            ]);

            const fullName = raName;
        // Split the full name into first and last name
            const [first, last] = await this.ra_split(fullName);

        // Selector for the first name input field
        const firstnameSelector = 'input[data-ng-model="agent.FirstName"]';
        await page.waitForSelector(firstnameSelector);
            await page.type(firstnameSelector, first || '');

        // Selector for the last name input field
        const lastnameSelector = 'input[data-ng-model="agent.LastName"]';
        await page.waitForSelector(lastnameSelector);
        await page.type(lastnameSelector, last || ''); 

        await page.waitForSelector('input.btn.btn-success.btn-md', { visible: true });
        await page.click('input.btn.btn-success.btn-md');
        
        // Wait for the button with 'value="Add New Agent"' to be visible
        await page.waitForSelector('input[value="Add New Agent"]', { visible: true });
        await page.evaluate(() => {
            document.querySelector('input[value="Add New Agent"]').click();
        });

            const emailInputSelector = 'input[name="EmailID"]';
        await page.waitForSelector(emailInputSelector);
            await page.type(emailInputSelector, raEmail);

        // Selector for the ConfirmEmailAddress input field
        const emailConfirmInputSelector = 'input[name="ConfirmEmailAddress"]'; 
        await page.waitForSelector(emailConfirmInputSelector);
            await page.type(emailConfirmInputSelector, raEmail);

        // Selector for the StreetAddress1 input field
        const streetAddressInputSelector = 'input[name="StreetAddress1"]';
        await page.waitForSelector(streetAddressInputSelector);
            await page.type(streetAddressInputSelector, raAddress);

            // Selector for the StreetAddress2 input field
        const streetAddress2InputSelector = 'input[name="StreetAddress2"]';
        await page.waitForSelector(streetAddress2InputSelector);
            await page.type(streetAddress2InputSelector, raAddress2);

        // Selector for the Zip input field
        const zipInputSelector = 'input[name="Zip5"]';
        await page.waitForSelector(zipInputSelector);
            await page.type(zipInputSelector, raZipCode);

            // Principal Office
            await new Promise(resolve => setTimeout(resolve, 6000))

            const emailInputSelecto = 'input[data-ng-model="principalData.EmailAddress"]';
            await page.waitForSelector(emailInputSelecto, { visible: true, timeout: 6000 }); 
            await page.type(emailInputSelecto, raEmail, { delay: 100 });

            // Selector for the Confirm Email input field
            const confirmEmailInputSelector = 'input[name="ConfirmEmail"]';
            await page.waitForSelector(confirmEmailInputSelector);
            await page.type(confirmEmailInputSelector, raEmail);

            // Get principal address information with fallbacks
            const paStreetAddress = mappingService.getValueFromPath(mappedPayload, [
                'Principal_Address.Street_Address',
                'Principal_Address.PA_Address_Line_1'
            ]) || mappingService.getValueFromPath(payload, [
                'Principal_Address.Street_Address',
                'Principal_Address.PA_Address_Line_1'
            ]);
            
            const paAddressLine2 = mappingService.getValueFromPath(mappedPayload, [
                'Principal_Address.Address_Line_2',
                'Principal_Address.PA_Address_Line_2'
            ]) || mappingService.getValueFromPath(payload, [
                'Principal_Address.Address_Line_2',
                'Principal_Address.PA_Address_Line_2'
            ]) || " ";
            
            const paZipCode = mappingService.getValueFromPath(mappedPayload, [
                'Principal_Address.Zip_Code',
                'Principal_Address.PA_Zip_Code'
            ]) || mappingService.getValueFromPath(payload, [
                'Principal_Address.Zip_Code',
                'Principal_Address.PA_Zip_Code'
            ]);

            const principalOfficeHeaderSelector = '.div_pdf_header_font.div_header.ng-binding';
            await page.waitForSelector(principalOfficeHeaderSelector);
            const streetAddress1Selector = `${principalOfficeHeaderSelector} ~ div input[name="StreetAddress1"]`;
            await page.waitForSelector(streetAddress1Selector);
            await page.type(streetAddress1Selector, paStreetAddress);

            const streetAddress2Selector = `${principalOfficeHeaderSelector} ~ div input[name="StreetAddress2"]`;
            await page.waitForSelector(streetAddress2Selector);
            await page.type(streetAddress2Selector, paAddressLine2);

            const principalOfficeHeaderSelector2 = '.div_pdf_header_font.div_header.ng-binding';
            await page.waitForSelector(principalOfficeHeaderSelector2);
            const streetAddress1Selector2 = `${principalOfficeHeaderSelector} ~ div input[name="Zip5"]`;
            await page.waitForSelector(streetAddress1Selector2);
            await page.type(streetAddress1Selector2, paZipCode);

            // Executor information
          // Checkbox
          await page.waitForSelector('#Executor_isUserPricipal');
          await new Promise(resolve => setTimeout(resolve, 6000));
          await page.click('#Executor_isUserPricipal');
          
          // button
          await page.waitForSelector('input[name="btnAddIncorporator"]');
          await new Promise(resolve => setTimeout(resolve, 6000));
          await page.click('input[name="btnAddIncorporator"]');

            // Governor Information
          await page.waitForSelector('#GoverningPerson_isUserPricipal');
          await new Promise(resolve => setTimeout(resolve, 6000));
          await page.click('#GoverningPerson_isUserPricipal');

          await page.waitForSelector('input[value="Add Governor"]');
          await new Promise(resolve => setTimeout(resolve, 4000));
          await page.click('input[value="Add Governor"]');

          // Nature of Business
          // Other
          await page.waitForSelector('#rdoOtherNAICS');
          await new Promise(resolve => setTimeout(resolve, 3000));
          await page.evaluate(() => {
            const checkbox = document.querySelector('#rdoOtherNAICS');
            if (checkbox) {
                    checkbox.click();
            }
          });

          // Other input fields
          await page.waitForSelector('#txtOtherNOBDesc');
          await new Promise(resolve => setTimeout(resolve, 3000));
          await page.type('#txtOtherNOBDesc', 'HardCoaded Field');
          await page.evaluate(() => {
            const textarea = document.querySelector('#txtOtherNOBDesc');
            if (textarea) {
                    textarea.dispatchEvent(new Event('blur', { bubbles: true }));
            }
          });

          // Authorized Person
          await page.waitForSelector('input[name="chkAuthorized"]');
          await new Promise(resolve => setTimeout(resolve, 3000));
          await page.click('input[name="chkAuthorized"]');

          // Checkbox
          await page.waitForSelector('input[name="isaccepted1"]');
          await new Promise(resolve => setTimeout(resolve, 3000));
          await page.click('input[name="isaccepted1"]');

          await page.waitForSelector('input[value="Continue"]');
          await new Promise(resolve => setTimeout(resolve, 3000));
          await page.click('input[value="Continue"]');

      } catch (error) {
          // Log full error stack for debugging
          logger.error('Error in Washington LLC form handler:', error.stack);
          throw new Error(`Washington LLC form submission failed: ${error.message}`);
        }
      }
    
    async fillInputByXPath(page, xpath, value) {
        await page.waitForXPath(xpath); 
        await page.type(xpath, value);  
    }
    }

module.exports = WashingtonForLLC;

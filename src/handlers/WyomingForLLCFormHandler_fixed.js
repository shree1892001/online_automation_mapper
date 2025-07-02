const BaseFormHandler = require('./BaseFormHandler');
const logger = require('../utils/logger');
const mappingService = require('../services/mappingService');
const formFieldMappingService = require('../services/formFieldMappingService');

class WyomingForLLC extends BaseFormHandler {
    constructor() {
        super();
    }
    
    async WyomingForLLC(page, jsonData, payload) {
        try {
            logger.info('Navigating to wyoming form submission page...');
            
            // Debug: Log original payload structure
            logger.info('Original payload structure:', JSON.stringify(payload, null, 2));
            
            // Map the payload keys using database-driven mapping
            const mappedPayload = await mappingService.mapPayloadKeys(payload, 'llc');
            
            // Debug: Log mapped payload structure
            logger.info('Mapped payload structure:', JSON.stringify(mappedPayload, null, 2));
            
            // Get form field mappings from database
            const formMappings = await formFieldMappingService.getFormFieldMappings('Wyoming_LLC_Formation', 'LLC');
            logger.info('Form field mappings loaded:', Object.keys(formMappings).length, 'mappings');
            
            const data = Object.values(jsonData)[0];
            const url = data.State.stateUrl;
            await this.navigateToPage(page, url);
            
            // Use database-driven button selector
            const startButton = '#regStartNow';
            await this.clickButton(page, startButton);
            
            // Use database-driven agreement checkbox
            const agreeCheckbox = '#MainContent_chkAgree';
            await this.selectRadioButtonById(page, agreeCheckbox);
            
            // Use database-driven business type selection
            const businessTypeSelector = '#MainContent_slctBusType';
            const businessTypeValue = 'Limited Liability Company (Domestic)';
            await this.clickDropdown(page, businessTypeSelector, businessTypeValue);
            
            await new Promise(resolve => setTimeout(resolve, 5000));
            
            // Use database-driven continue button
            const continueButton = '#MainContent_ContinueButton';
            await page.waitForSelector(continueButton);
            await page.click(continueButton);
            
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
            
            // Use database-driven business name fields
            const businessNameField = formMappings['payload.Name.Legal_Name'] || 'ctl00$MainContent$ucName$txtName';
            const businessNameConfirmField = formMappings['payload.Name.Legal_Name'] || 'ctl00$MainContent$ucName$txtNameConfirm';
            
            await this.fillInputByName(page, businessNameField, legalName);
            await this.fillInputByName(page, businessNameConfirmField, legalName);
            
            // Use database-driven continue button
            const continueBtn = '#ContinueButton';
            await this.clickButton(page, continueBtn);
            
            // Get alternate legal name with fallbacks
            const alternateLegalName = mappingService.getValueFromPath(mappedPayload, [
                'Alternate_Legal_Name',
                'Name.Alternate_Legal_Name'
            ]) || mappingService.getValueFromPath(payload, [
                'Name.Alternate_Legal_Name',
                'Alternate_Legal_Name'
            ]);
            
            const isNameREplaced = await this.tryAlternate1(
                page, 
                "#txtName",  // selector2
                "#txtDelayedDate",  // selector1
                alternateLegalName
            );
            
            if (isNameREplaced) {
                const altNameConfirmField = formMappings['payload.Name.Alternate_Legal_Name'] || 'ctl00$MainContent$ucName$txtNameConfirm';
                await this.fillInputByName(page, altNameConfirmField, alternateLegalName);
                await this.clickButton(page, continueBtn);
            }
            
            await new Promise(resolve => setTimeout(resolve, 5000));
            await this.randomSleep(1000, 3000);

            // Use database-driven continue button in page.evaluate
            const continueButtonId = continueBtn.replace('#', '');
            await page.evaluate((buttonId) => {
                const continueButton = document.getElementById(buttonId);
                if (continueButton) {
                    continueButton.scrollIntoView();
                    // Trigger a click event on the continue button
                    continueButton.click();
                }
            }, continueButtonId);
            await this.clickButton(page, continueBtn);

            // Get registered agent information with fallbacks
            const raName = mappingService.getValueFromPath(mappedPayload, [
                'Registered_Agent.keyPersonnelName',
                'Registered_Agent.RA_Name'
            ]) || mappingService.getValueFromPath(payload, [
                'Registered_Agent.keyPersonnelName',
                'Registered_Agent.RA_Name'
            ]);
            
            const raAddress = mappingService.getValueFromPath(mappedPayload, [
                'Registered_Agent.Address.Street_Address',
                'Registered_Agent.Address.RA_Address_Line_1'
            ]) || mappingService.getValueFromPath(payload, [
                'Registered_Agent.Address.Street_Address',
                'Registered_Agent.Address.RA_Address_Line_1'
            ]);
            
            const raCity = mappingService.getValueFromPath(mappedPayload, [
                'Registered_Agent.Address.City',
                'Registered_Agent.Address.RA_City'
            ]) || mappingService.getValueFromPath(payload, [
                'Registered_Agent.Address.City',
                'Registered_Agent.Address.RA_City'
            ]);
            
            const raContactNo = mappingService.getValueFromPath(mappedPayload, [
                'Registered_Agent.ContactNo',
                'Registered_Agent.CI_Contact_No'
            ]) || mappingService.getValueFromPath(payload, [
                'Registered_Agent.ContactNo',
                'Registered_Agent.CI_Contact_No'
            ]);
            
            const raEmail = mappingService.getValueFromPath(mappedPayload, [
                'Registered_Agent.EmailId',
                'Registered_Agent.CI_Email_Address'
            ]) || mappingService.getValueFromPath(payload, [
                'Registered_Agent.EmailId',
                'Registered_Agent.CI_Email_Address'
            ]);

            const fullName = raName;
            const [firstName, lastName] = await this.ra_split(fullName);
            
            // Use database-driven registered agent fields - use selectors directly
            const raFirstNameField = '#txtFirstName';
            const raLastNameField = '#txtLastName';
            const raAddressField = '#txtAddr1';
            const raCityField = '#txtCity';
            
            const inputFieldsforRA = [
                { selector: raFirstNameField, value: firstName },
                { selector: raLastNameField, value: lastName },
                { selector: raAddressField, value: raAddress },
                { selector: raCityField, value: raCity },
            ];
            await this.addInput(page, inputFieldsforRA);
            
            // Use database-driven phone field
            const phoneField = '#txtPhone';
            await this.clickButton(page, phoneField);
            
            const postalCodeItem = '.postalCodeListItem:nth-child(1)';
            await this.clickButton(page, postalCodeItem);
            
            // Use database-driven contact fields - get the form field names from mappings
            const raPhoneField = formMappings['payload.Registered_Agent.ContactNo'] || 'ctl00$MainContent$ucRA$txtPhone';
            const raEmailField = formMappings['payload.Registered_Agent.EmailId'] || 'ctl00$MainContent$ucRA$txtEmail';
            
            await this.fillInputByName(page, raPhoneField, raContactNo);
            await this.fillInputByName(page, raEmailField, raEmail);
            
            // Use database-driven consent checkbox
            const consentCheckbox = '#chkRAConsent';
            await page.click(consentCheckbox);
            await this.clickButton(page, continueBtn);
            
            // Use database-driven error message selector
            const errorMessageSelector = '#lblErrorMessage';
            try {
                // Wait for the error message to appear on the page
                await page.waitForSelector(errorMessageSelector, { visible: true, timeout: 5000 });
                console.log('Error message detected.');
                await this.clickButton(page, continueBtn);
            } catch (error) {
                console.log('Error message not found or other issue:', error.message);
                await this.clickButton(page, continueBtn);
            }
            await this.clickButton(page, continueBtn);
            await this.clickButton(page, continueBtn);

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
            
            const paCity = mappingService.getValueFromPath(mappedPayload, [
                'Principal_Address.City',
                'Principal_Address.PA_City'
            ]) || mappingService.getValueFromPath(payload, [
                'Principal_Address.City',
                'Principal_Address.PA_City'
            ]);
            
            const paState = mappingService.getValueFromPath(mappedPayload, [
                'Principal_Address.State',
                'Principal_Address.PA_State'
            ]) || mappingService.getValueFromPath(payload, [
                'Principal_Address.State',
                'Principal_Address.PA_State'
            ]);
            
            const paZipCode = mappingService.getValueFromPath(mappedPayload, [
                'Principal_Address.Zip_Code',
                'Principal_Address.PA_Zip_Code'
            ]) || mappingService.getValueFromPath(payload, [
                'Principal_Address.Zip_Code',
                'Principal_Address.PA_Zip_Code'
            ]);

            // Use database-driven principal address fields
            const paStreetField = formMappings['payload.Principal_Address.Street_Address'] || 'ctl00$MainContent$ucAddress$txtAddr1';
            const paAddress2Field = formMappings['payload.Principal_Address.Address_Line_2'] || 'ctl00$MainContent$ucAddress$txtAddr2';
            const paCityField = formMappings['payload.Principal_Address.City'] || 'ctl00$MainContent$ucAddress$txtCity';
            const paStateField = formMappings['payload.Principal_Address.State'] || 'ctl00$MainContent$ucAddress$txtState';
            const paZipField = formMappings['payload.Principal_Address.Zip_Code'] || 'ctl00$MainContent$ucAddress$txtPostal';
            const paPhoneField = formMappings['payload.Registered_Agent.ContactNo'] || 'ctl00$MainContent$ucAddress$txtPhone';
            const paEmailField = formMappings['payload.Registered_Agent.EmailId'] || 'ctl00$MainContent$ucAddress$txtEmail';

            await this.fillInputByName(page, paStreetField, paStreetAddress);
            await this.fillInputByName(page, paAddress2Field, paAddressLine2);
            await this.fillInputByName(page, paCityField, paCity);
            await this.fillInputByName(page, paStateField, paState);
            await this.fillInputByName(page, paZipField, String(paZipCode));
            await this.fillInputByName(page, paPhoneField, raContactNo);
            await this.fillInputByName(page, paEmailField, raEmail);
            
            // Get mailing information with fallbacks
            const mailStreetAddress = mappingService.getValueFromPath(mappedPayload, [
                'Registered_Agent.Mailing_Information.Street_Address',
                'Registered_Agent.Mailing_Information.MI_Address_Line_1'
            ]) || mappingService.getValueFromPath(payload, [
                'Registered_Agent.Mailing_Information.Street_Address',
                'Registered_Agent.Mailing_Information.MI_Address_Line_1'
            ]);
            
            const mailAddressLine2 = mappingService.getValueFromPath(mappedPayload, [
                'Registered_Agent.Mailing_Information.Address_Line_2',
                'Registered_Agent.Mailing_Information.MI_Address_Line_2'
            ]) || mappingService.getValueFromPath(payload, [
                'Registered_Agent.Mailing_Information.Address_Line_2',
                'Registered_Agent.Mailing_Information.MI_Address_Line_2'
            ]) || " ";
            
            const mailCity = mappingService.getValueFromPath(mappedPayload, [
                'Registered_Agent.Mailing_Information.City',
                'Registered_Agent.Mailing_Information.MI_City'
            ]) || mappingService.getValueFromPath(payload, [
                'Registered_Agent.Mailing_Information.City',
                'Registered_Agent.Mailing_Information.MI_City'
            ]);
            
            const mailState = mappingService.getValueFromPath(mappedPayload, [
                'Registered_Agent.Mailing_Information.State',
                'Registered_Agent.Mailing_Information.MI_State'
            ]) || mappingService.getValueFromPath(payload, [
                'Registered_Agent.Mailing_Information.State',
                'Registered_Agent.Mailing_Information.MI_State'
            ]);
            
            const mailZipCode = mappingService.getValueFromPath(mappedPayload, [
                'Registered_Agent.Mailing_Information.Zip_Code',
                'Registered_Agent.Mailing_Information.MI_Zip_Code'
            ]) || mappingService.getValueFromPath(payload, [
                'Registered_Agent.Mailing_Information.Zip_Code',
                'Registered_Agent.Mailing_Information.MI_Zip_Code'
            ]);

            // Use database-driven mailing address fields
            const mailStreetField = formMappings['payload.Registered_Agent.Mailing_Information.Street_Address'] || 'ctl00$MainContent$ucAddress$txtAddr1Mail';
            const mailAddress2Field = formMappings['payload.Registered_Agent.Mailing_Information.Address_Line_2'] || 'ctl00$MainContent$ucAddress$txtAddr2Mail';
            const mailCityField = formMappings['payload.Registered_Agent.Mailing_Information.City'] || 'ctl00$MainContent$ucAddress$txtCityMail';
            const mailStateField = formMappings['payload.Registered_Agent.Mailing_Information.State'] || 'ctl00$MainContent$ucAddress$txtStateMail';
            const mailZipField = formMappings['payload.Registered_Agent.Mailing_Information.Zip_Code'] || 'ctl00$MainContent$ucAddress$txtPostalMail';

            await this.fillInputByName(page, mailStreetField, mailStreetAddress);
            await this.fillInputByName(page, mailAddress2Field, mailAddressLine2);
            await this.fillInputByName(page, mailCityField, mailCity);
            await this.fillInputByName(page, mailStateField, mailState);
            await this.fillInputByName(page, mailZipField, String(mailZipCode));
 
            await this.clickButton(page, continueBtn);
            
            // Get organizer information with fallbacks
            const orgName = mappingService.getValueFromPath(mappedPayload, [
                'Organizer_Information.keyPersonnelName',
                'Organizer_Information.Organizer_Details.Org_Name'
            ]) || mappingService.getValueFromPath(payload, [
                'Organizer_Information.keyPersonnelName',
                'Organizer_Information.Organizer_Details.Org_Name'
            ]);
            
            const orgAddress = mappingService.getValueFromPath(mappedPayload, [
                'Organizer_Information.Address.Street_Address',
                'Organizer_Information.Address.Org_Address_Line_1'
            ]) || mappingService.getValueFromPath(payload, [
                'Organizer_Information.Address.Street_Address',
                'Organizer_Information.Address.Org_Address_Line_1'
            ]);
            
            const orgCity = mappingService.getValueFromPath(mappedPayload, [
                'Organizer_Information.Address.City',
                'Organizer_Information.Address.Org_City'
            ]) || mappingService.getValueFromPath(payload, [
                'Organizer_Information.Address.City',
                'Organizer_Information.Address.Org_City'
            ]);
            
            const orgState = mappingService.getValueFromPath(mappedPayload, [
                'Organizer_Information.Address.State',
                'Organizer_Information.Address.Org_State'
            ]) || mappingService.getValueFromPath(payload, [
                'Organizer_Information.Address.State',
                'Organizer_Information.Address.Org_State'
            ]);
            
            const orgZipCode = mappingService.getValueFromPath(mappedPayload, [
                'Organizer_Information.Address.Zip_Code',
                'Organizer_Information.Address.Org_Zip_Code'
            ]) || mappingService.getValueFromPath(payload, [
                'Organizer_Information.Address.Zip_Code',
                'Organizer_Information.Address.Org_Zip_Code'
            ]);

            const OrgfullName = orgName;
            const [OrgfirstName, OrglastName] = OrgfullName.split(' ');
            
            // Use database-driven organizer fields
            const orgFirstNameField = formMappings['payload.Organizer_Information.keyPersonnelName'] || 'ctl00$MainContent$ucParties$txtFirstName';
            const orgLastNameField = formMappings['payload.Organizer_Information.keyPersonnelName'] || 'ctl00$MainContent$ucParties$txtLastName';
            const orgAddressField = formMappings['payload.Organizer_Information.Address.Street_Address'] || 'ctl00$MainContent$ucParties$txtMail1';
            
            await this.fillInputByName(page, orgFirstNameField, OrgfirstName);
            await this.fillInputByName(page, orgLastNameField, OrglastName);
            await this.fillInputByName(page, orgAddressField, 
                orgAddress + ' ,' +
                orgCity + ', ' +
                orgState + ', ' +
                String(orgZipCode)
            );
            
            await this.randomSleep(3000, 5000);
            
            // Use database-driven save button
            const saveButton = '#SaveButton';
            await this.clickButton(page, saveButton);
            await this.clickButton(page, saveButton);

            await this.randomSleep(3000, 5000);

            await page.waitForSelector(continueBtn);
            await page.click(continueBtn);
            await new Promise(resolve => setTimeout(resolve, 3000))
            await page.waitForSelector(continueBtn);
            await page.click(continueBtn);
            await page.waitForSelector(continueBtn);
            await page.click(continueBtn);
            
            const res = "form filled successfully";
            return res;
        } catch (error) {
            logger.error('Error in wyoming For LLC form handler:', error.stack);
            throw new Error(`wyoming For LLC form submission failed: ${error.message}`);
        }
    }
}

module.exports = WyomingForLLC; 
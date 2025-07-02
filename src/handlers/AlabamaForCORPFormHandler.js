const BaseFormHandler = require('./BaseFormHandler');
const logger = require('../utils/logger');

class AlabamaForCORP extends BaseFormHandler {
    constructor() {
        super();
    }
    async normalizePhoneNumber(phoneNumber) {
        // Remove all non-digit characters
        const digits = phoneNumber.replace(/\D/g, '');

        // Check the length of the digits
        if (digits.length === 10) {
            // Format as +1-XXX-XXX-XXXX
            return `1${digits.slice(0, 3)}${digits.slice(3, 6)}${digits.slice(6)}`;
        } else if (digits.length === 11 && digits.startsWith('1')) {
            // Format as +1-XXX-XXX-XXXX
            return `${digits[0]}${digits.slice(1, 4)}${digits.slice(4, 7)}${digits.slice(7)}`;
        } else {
            // Invalid number
            return null;
        }
    }

    async AlabamaForCORP(page,jsonData,payload) {
        try {
            logger.info('Navigating to New York form submission page...');
                        const data = Object.values(jsonData)[0];

            const url = data.State.stateUrl;
            // Click the link "Continue to application"

            await this.navigateToPage(page, url);
            await page.click('a[href="introduction_input.action"]');
            await this.clickOnLinkByText(page, 'Continue to application');
            await this.fillInputByName(page, 'contact.contactName', payload.Contact_Information.CI_Name);
            const pno =  payload.Incorporator_Information.Incorporator_Details.Inc_Contact_No;
            const normalizedPhoneNumber = await this.normalizePhoneNumber(pno);

            // Check if phone number normalization was successful
            if (normalizedPhoneNumber) {
                await this.fillInputByName(page, 'contact.primaryPhone', normalizedPhoneNumber);
            } else {
                throw new Error('Invalid phone number');
            }
            await this.fillInputByName(page, 'contact.emailAddress', payload.Contact_Information.CI_Email_Address);
            await this.fillInputByName(page, 'contact.confirmEmailAddress', payload.Contact_Information.CI_Email_Address);
            await this.fillInputByName(page, 'contact.streetAddress', payload.Contact_Information.Address.CI_Address_Line_1);
            await this.fillInputByName(page, 'contact.city', payload.Contact_Information.Address.CI_City);
            await this.fillInputByName(page, 'contact.zipCode', String(payload.Contact_Information.Address.CI_Zip_Code));
            await this.clickButton(page, '#contactInformation_action_0');
            await this.fillInputByName(page, 'businessName', payload.Name.Legal_Name);
            await this.clickButton(page, '#reservation_action_0');
            await this.selectRadioButtonById(page, 'reservationTypeDOMESTIC');
            await this.selectRadioButtonById(page, 'entityTypeCORPORATION');
            await this.clickButton(page, '#entityInformation_action_0');
            //alternate legal name 
            const isNameREplaced=await this.tryAlternate(
                page, 
                "#legalName",  // selector2
                "h3:has-text('Filing Online')",  // selector1
                "#entityInformation_action_0",  // nextbtnSelec
                payload.Name.Alternate_Legal_Name
              
            );
            await this.clickOnLinkByText(page, 'File of Formation Data');
            await this.selectRadioButtonById(page, 'requestorTypeINDIVIDUAL');
            await this.randomSleep(10000,20000);
            await this.fillInputByName(page, 'requestor.issueName', payload.Incorporator_Information.Incorporator_Details.keyPersonnelName);
            await this.fillInputByName(page, 'requestor.issueStreetAddress', payload.Incorporator_Information.Address.Street_Address);
            await this.fillInputByName(page, 'requestor.issueCity', payload.Incorporator_Information.Address.City);
            await this.fillInputByName(page, 'requestor.issueZip', payload.Incorporator_Information.Address.Zip_Code.toString());
            await this.clickButton(page, '#requestorInformation_action_0');
            await page.waitForSelector('#review', { visible: true, timeout: 30000 });
            await page.click('#review');
            console.log('Checked the checkbox with ID "review"');

            // Click the "Continue" button by ID "reviewReservation_action_0"
            await this.clickButton(page, '#reviewReservation_action_0');

            // Select "BARBOUR" from the dropdown
            await this.clickDropdown(page, '#countyOfFormation',jsonData.data.County.countyName);
            console.log('Selected "BARBOUR" from the dropdown');

            await this.fillInputByName(page, 'options.purpose', 'Business Purpose');
            await this.fillInputByName(page, 'options.numberOfShares', String(payload.Stock_Details.Number_Of_Shares));

            await page.waitForSelector('#certifyPeriodOfDuration', { visible: true, timeout: 30000 });
            await page.click('#certifyPeriodOfDuration');

            // Click on the next "Continue" button by ID "filingOptions_action_0"
            await this.clickButton(page, '#filingOptions_action_0');


            //add principle address
            await this.fillInputByName(page, 'principalAddress.principalAddressStreet', payload.Principal_Address.Street_Address);
            await this.fillInputByName(page, 'principalAddress.principalAddressCity', payload.Principal_Address.City);
            await this.fillInputByName(page, 'principalAddress.principalAddressZipCode', payload.Principal_Address.Zip_Code.toString()
        );
            await this.clickOnLinkByText(page, 'Copy Principal Address to Mailing Address');
            await this.clickButton(page, '#principalAddress_action_0');

            // Select the registered agent type radio button with ID "registeredAgentTypeINDIVIDUAL"
            await this.selectRadioButtonById(page, 'registeredAgentTypeINDIVIDUAL');
            const rafullname = payload.Registered_Agent.keyPersonnelName;
            const [firstName, lastName] = rafullname.split(' ');
            await this.fillInputByName(page, 'agent.lastName', lastName);
            await this.fillInputByName(page, 'agent.firstName', firstName);
            await this.fillInputByName(page, 'agent.officeAddressStreet', payload.Registered_Agent.Address.Street_Address);
            await this.fillInputByName(page, 'agent.officeAddressCity', payload.Registered_Agent.Address.City);
            await this.fillInputByName(page, 'agent.officeAddressZipCode', payload.Registered_Agent.Address.Zip_Code.toString());

            // Check the checkbox to certify registered agent
            await page.waitForSelector('#certifyPhysicalAddress', { visible: true, timeout: 30000 });
            await page.click('#certifyPhysicalAddress');
            console.log('Checked the checkbox with ID "certifyPhysicalAddress"');

            // Click the "Copy Office Address to Mailing Address" link
            await this.fillInputByName(page, 'agent.mailingAddressStreet', payload.Registered_Agent.Mailing_Information.Street_Address);
            await this.fillInputByName(page, 'agent.mailingAddressCity', payload.Registered_Agent.Mailing_Information.City);
            await this.fillInputByName(page, 'agent.mailingAddressZipCode', String(payload.Registered_Agent.Mailing_Information.Zip_Code));
            await this.clickDropdown(page, '#mailingAddressCounty', jsonData.data.County.countyName);
            // Check the checkbox to certify registered agent
            await page.waitForSelector('#certifyRegisteredAgent', { visible: true, timeout: 30000 });
            await page.click('#certifyRegisteredAgent');
            console.log('Checked the checkbox with ID "certifyRegisteredAgent"');
        
            // Click the "Continue" button by ID "registeredAgent_action_0"
            await this.clickButton(page, '#registeredAgent_action_0');

            await new Promise(resolve => setTimeout(resolve, 4000))

            //add incorporator information
            await this.selectRadioButtonById(page, 'registeredAgentTypeINDIVIDUAL');
            const incfullname = payload.Incorporator_Information.Incorporator_Details.keyPersonnelName;
            const [incfirstName, inclastName] = incfullname.split(' ');
            await this.fillInputByName(page, 'incorporator.lastName', inclastName);
            await this.fillInputByName(page, 'incorporator.firstName', incfirstName);
            await this.fillInputByName(page, 'incorporator.officeAddressStreet', payload.Incorporator_Information.Address.Street_Address);
            await this.fillInputByName(page, 'incorporator.officeAddressCity', payload.Incorporator_Information.Address.City);
            await this.fillInputByName(page, 'incorporator.officeAddressZipCode', payload.Incorporator_Information.Address.Zip_Code.toString());
            await this.clickOnLinkByText(page, 'Copy Street Address to Mailing Address');

            await page.waitForSelector('#incorporators_action_0');  // Wait for the button to be visible
            await page.click('#incorporators_action_0');
            await this.clickOnLinkByText(page, 'Continue');
            await page.waitForSelector('#certify', { visible: true, timeout: 30000 });
            await page.click('#certify');
            // Click "Continue" on organizer page
            await this.clickButton(page, '#directors_action_0');

            // Click "Continue" for document uploads
            await this.clickButton(page, '#documentUploads_action_0');

            // Check the checkbox for "cpoQuestions.other"
            await page.waitForSelector('#other', { visible: true, timeout: 30000 });
            await page.click('#other');
            console.log('Checked the checkbox with ID "other"');
            
            await page.waitForSelector('#cpoQuestions_action_0');  // Wait for the button to be visible
            await page.click('#cpoQuestions_action_0'); 
            const res = "form filled successfully";
            return res   
        } catch (error) {
            logger.error('Error in Alabama For Corp form handler:', error.stack);
            throw new Error(`Alabama For Corp form submission failed: ${error.message}`);
        }
    }
}

module.exports = AlabamaForCORP;



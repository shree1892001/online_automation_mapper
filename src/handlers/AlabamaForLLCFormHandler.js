const BaseFormHandler = require('./BaseFormHandler');
const logger = require('../utils/logger');

class AlabamaForLLC extends BaseFormHandler {
    constructor() {
        super();
    }

    // Corrected normalizePhoneNumber function
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

    async AlabamaForLLC(page,jsonData,payload) {
        console.log(payload)
        try {
            logger.info('Navigating to Alabama form submission page...');

            const data = Object.values(jsonData)[0];

            const url = data.State.stateUrl;

            // Navigate to the page
            await this.navigateToPage(page, url);
            await page.click('a[href="introduction_input.action"]');
            await this.clickOnLinkByText(page, 'Continue to application');
            await this.fillInputByName(page, 'contact.contactName', payload.Contact_Information.Name);

            // Correct phone number normalization
            const pno = payload.Contact_Information.CI_Contact_No;
            const normalizedPhoneNumber = await this.normalizePhoneNumber(pno);

            // Check if phone number normalization was successful
            if (normalizedPhoneNumber) {
                await this.fillInputByName(page, 'contact.primaryPhone', normalizedPhoneNumber);
            } else {
                throw new Error('Invalid phone number');
            }  

            await this.fillInputByName(page, 'contact.emailAddress', payload.Contact_Information.Email_Address);
            await this.fillInputByName(page, 'contact.confirmEmailAddress', payload.Contact_Information.Email_Address);
            await this.fillInputByName(page, 'contact.streetAddress', payload.Contact_Information.Address.Street_Address);
            await this.fillInputByName(page, 'contact.city', payload.Contact_Information.Address.City);
            await this.fillInputByName(page, 'contact.zipCode', String(payload.Contact_Information.Address.Zip_Code));
            await this.clickButton(page, '#contactInformation_action_0');
            await this.fillInputByName(page, 'businessName', payload.Name.Legal_Name);
            await this.clickButton(page, '#reservation_action_0');
            await this.selectRadioButtonById(page, 'reservationTypeDOMESTIC');
            await this.selectRadioButtonById(page, 'entityTypeLLC');
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
            await this.selectRadioButtonById(page, 'requestorTypeORGANIZATION');
            await this.fillInputByName(page, 'requestor.issueName', payload.Organizer_Information.keyPersonnelName);
            await this.fillInputByName(page, 'requestor.issueStreetAddress', payload.Registered_Agent.Address.City);
            await this.fillInputByName(page, 'requestor.issueCity', payload.Registered_Agent.Address.City);
            await this.fillInputByName(page, 'requestor.issueZip', String(payload.Registered_Agent.Address.Zip_Code));
            await this.clickButton(page, '#requestorInformation_action_0');
            await page.waitForSelector('#review', { visible: true, timeout: 30000 });
            await page.click('#review');
            console.log('Checked the checkbox with ID "review"');

            // Click the "Continue" button by ID "reviewReservation_action_0"
            await this.clickButton(page, '#reviewReservation_action_0');

            // Select "BARBOUR" from the dropdown
            await this.clickDropdown(page, '#countyOfFormation',jsonData.data.County.countyName);
            console.log('Selected "BARBOUR" from the dropdown');

            // Select the radio button for LLC type with ID "llcTypeLL"
            await this.selectRadioButtonById(page, 'llcTypeLL');

            // Click on the next "Continue" button by ID "filingOptions_action_0"
            await this.clickButton(page, '#filingOptions_action_0');

            // Select the registered agent type radio button with ID "registeredAgentTypeINDIVIDUAL"
            await this.selectRadioButtonById(page, 'registeredAgentTypeINDIVIDUAL');
            const rafullname = payload.Registered_Agent.keyPersonnelName;
            const [firstName, lastName] = rafullname.split(' ');
            await this.fillInputByName(page, 'agent.lastName', lastName);
            await this.fillInputByName(page, 'agent.firstName', firstName);
            await this.fillInputByName(page, 'agent.officeAddressStreet', payload.Registered_Agent.Address.Street_Address);
            await this.fillInputByName(page, 'agent.officeAddressCity', payload.Registered_Agent.Address.City);
            await this.fillInputByName(page, 'agent.officeAddressZipCode', String(payload.Registered_Agent.Address.Zip_Code));

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

            await new Promise(resolve => setTimeout(resolve, 4000));

            // Click the "Add New Organizer" button
            // await page.click('a[href="/sos/organizers_add.action"]');
            // const orgfullname = payload.Organizer_Information.keyPersonnelName;
            // const [orgfirstName, orglastName] = orgfullname.split(' ');
            // // Select radio button for organizer with ID "registeredAgentTypeINDIVIDUAL"
            // await this.selectRadioButtonById(page, 'registeredAgentTypeINDIVIDUAL');
            // await this.fillInputByName(page, 'organizer.lastName', orglastName);
            // await this.fillInputByName(page, 'organizer.firstName', orgfirstName);
            // await this.fillInputByName(page, 'organizer.officeAddressStreet', payload.Registered_Agent.Address.Street_Address);
            // await this.fillInputByName(page, 'organizer.officeAddressCity', payload.Registered_Agent.Address.City);
            // await this.fillInputByName(page, 'organizer.officeAddressZipCode', String(payload.Registered_Agent.Address.Zip_Code));

            // // Copy organizer address
            // await this.clickOnLinkByText(page, 'Copy Office Address to Mailing Address');

            // await page.waitForSelector('#organizers_action_0');  // Wait for the button to be visible
            // await page.click('#organizers_action_0');
            // Click "Continue" on organizer page
            await this.clickOnLinkByText(page, 'Continue');

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
            logger.error('Error in Alabama For LLC form handler:', error.stack);
            throw new Error(`Alabama For LLC form submission failed: ${error.message}`);
        }
    }
}

module.exports = AlabamaForLLC;

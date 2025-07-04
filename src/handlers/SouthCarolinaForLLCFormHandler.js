const BaseFormHandler = require('./BaseFormHandler');
const logger = require('../utils/logger');

class SouthCarolinaForLLC extends BaseFormHandler {
    constructor() {
        super();
    }
    async SouthCarolinaForLLC(page,jsonData,payload) {
        try {
            logger.info('Navigating to New York form submission page...');
            const data = Object.values(jsonData)[0];

            const url = data.State.stateUrl;;
            await this.navigateToPage(page, url);
            //login 
            await this.clickOnLinkByText(page, 'Log In');
            await this.fillInputByName(page, 'Username', data.State.filingWebsiteUsername);
            await this.fillInputByName(page, 'Password', data.State.filingWebsitePassword);
            await this.clickButton(page, '.mainButton');
            //enter businees name
            await this.fillInputByName(page, 'EntityName', payload.Name.Legal_Name);
            await this.clickButton(page, '#AddEntityButton');
            // await this.selectRadioButtonById(page, 'DomesticRadioButton');
            // await this.clickButton(page, '#AddIndistinguishableEntityButton');
            //alternate legal name 
            try{
                await page.waitForSelector('#EntityTypes', { visible: true, timeout: 10000 });
                console.log("dropdown not found")
            } catch (error) {
                await this.clickOnLinkByText(page, 'Back');
                await this.waitForTimeout(10000)
                await this.clearFieldWithDelete(page, 'input[name="EntityName"]');
                await this.fillInputByName(page, 'EntityName', payload.Name.Alternate_Legal_Name);
                await this.clickButton(page, '#AddEntityButton');
            }


            // Entity Type
            await this.clickDropdown(page, '#EntityTypes', 'Limited Liability Company');
            await this.clickButton(page, 'a.startButton');
            //add registered agent information

            await this.fillInputByName(page, 'ContactCdto.Contact.Name', payload.Contact_Information.Name);
            await this.fillInputByName(page, 'ContactCdto.Contact.Email', payload.Contact_Information.Email_Address);
            await this.fillInputByName(page, 'ContactCdto.Contact.Phone', payload.Contact_Information.CI_Contact_No);
            await this.fillInputByName(page, 'ContactCdto.AddressCdto.Address1', payload.Contact_Information.Address.Street_Address);

            await this.fillInputByName(page, 'ContactCdto.AddressCdto.City', payload.Contact_Information.Address.City);
            await this.clickDropdown(page, '#ContactCdto_AddressCdto_StateId', payload.Contact_Information.Address.CI_State);
            await this.fillInputByName(page, 'ContactCdto.AddressCdto.ZipCode', String(payload.Contact_Information.Address.Zip_Code));
            await this.clickButton(page, '#ContinueButton');

            await this.randomSleep(3000, 5000);
            await this.fillInputByName(page, 'FormsCdto.Agent.AgentName', payload.Registered_Agent.keyPersonnelName);
            await this.waitForTimeout(2000)
            await this.fillInputByName(page, 'FormsCdto.Agent.AgentAddressCdto.Address1', payload.Registered_Agent.Address.Street_Address);

            await this.fillInputByName(page, 'FormsCdto.Agent.AgentAddressCdto.City', payload.Registered_Agent.Address.City);
            await this.fillInputByName(page, 'FormsCdto.Agent.AgentAddressCdto.ZipCode', String(payload.Registered_Agent.Address.Zip_Code));
            //add principle address information
            await this.fillInputByName(page, 'FormsCdto.Address.Address1', payload.Principal_Address.Street_Address);

            await this.fillInputByName(page, 'FormsCdto.Address.City', payload.Principal_Address.City);
            await this.fillInputByName(page, 'FormsCdto.Address.ZipCode', String(payload.Principal_Address.Zip_Code));
            //add organizer information
            await this.fillInputByName(page, 'FormsCdto.OrganizerCdto.OrganizerName', payload.Organizer_Information.keyPersonnelName);
            await this.waitForTimeout(1000)
            await this.fillInputByName(page, 'FormsCdto.OrganizerCdto.OrganizerAddressCdto.Address1', payload.Organizer_Information.Address.Street_Address);
            await this.waitForTimeout(1000)
            await this.fillInputByName(page, 'FormsCdto.OrganizerCdto.OrganizerAddressCdto.City', payload.Organizer_Information.Address.City);
            await this.clickDropdown(page, '#FormsCdto_OrganizerCdto_OrganizerAddressCdto_StateId', payload.organizer_information.Address.state);
            await this.fillInputByName(page, 'FormsCdto.OrganizerCdto.OrganizerAddressCdto.ZipCode', String(payload.Organizer_Information.Address.Zip_Code));
            //add signature for organizer
            await this.clickDropdown(page, '#FormsCdto_OrganizerCdto_OrganizerSignatureCdto_SelectedOption', 'Organizer');
            await page.click('#OrganizerSignatureConfirmationCheckbox');
            await this.fillInputByName(page, 'FormsCdto.OrganizerCdto.OrganizerSignatureCdto.Text', payload.Organizer_Information.keyPersonnelName);
            
            await this.clickButton(page, '#ContinueButton');
            
            const res = "form filled successfully";
            return res
            
            
        } catch (error) {
            logger.error('Error in South Carolina For LLC form handler:', error.stack);
            throw new Error(`South Carolina For LLC form submission failed: ${error.message}`);
        }
    }
}

module.exports = SouthCarolinaForLLC;



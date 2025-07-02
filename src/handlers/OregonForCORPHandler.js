const BaseFormHandler = require('./BaseFormHandler');
const logger = require('../utils/logger');
//const {selectRadioButtonByLabel,clickOnTitle,navigateToPage,addInput,clickButton  } = require('../utils/puppeteerUtils');

class OregonForCORP extends BaseFormHandler {
    constructor() {
        super();
    }
    async OregonForCorp(page,jsonData,payload) {
        try {
            logger.info('Navigating to New York form submission page...');
            const data = Object.values(jsonData)[0];

            const url = data.State.stateUrl;;
            await this.navigateToPage(page, url);
            await this.clickOnLinkByText(page, 'Register a Business Online');
            try {
                // Try to click the first button
                await this.clickButton(page, 'a.btn.btn-primary', true, { visible: true });
            } catch (error) {
                console.error('Failed to click "Continue" button. Trying the "I understand and wish to continue" link:', error.message);
                try {
                    // If the first button click fails, try clicking the second link
                    await this.clickButton(page, 'a[href="https://secure.sos.state.or.us/cbrmanager/index.action"]', true, { visible: true });
                } catch (secondError) {
                    console.error('Failed to click the "I understand and wish to continue" link as well:', secondError.message);
                    // Proceed to the next step if both clicks fail
                }
            }
            await this.clickButton(page, '#loginButton');
            await this.fillInputByName(page, 'username', data.State.filingWebsiteUsername);
            await this.fillInputByName(page, 'password', data.State.filingWebsitePassword);
            await this.clickButton(page, 'input[name="Login"]');
            await this.clickButton(page, '#startBusinessButtonID', true, { visible: true });
            await this.clickButton(page, '#startBusinessButtonID', true, { visible: true });
            await this.clickButton(page, '#startBusRegBtn');
            await this.clickDropdown(page, '#filingType', 'Domestic Business Corporation');
            await page.waitForSelector('#busOverview_businessName', { visible: true });
            await page.type('#busOverview_businessName', payload.Name.Legal_Name);
            await page.type('#busOverview_activityDescription',"Business Purpose")
            await this.fillInputByIdSingle(page, '#busOverview_emailAddress_emailAddress', payload.Incorporator_Information.Email_Address);
            await this.fillInputByIdSingle(page, '#busOverview_emailAddress_emailAddressVerification', payload.Incorporator_Information.Email_Address);
            await this.fillInputByIdSingle(page, '#busOverview_principalAddr_addressLine1',payload.Principal_Address.Street_Address);
            await this.fillInputByIdSingle(page, '#busOverview_principalAddr_addressLine2',payload.Principal_Address['Address_Line_2']  || " ");

            await this.fillInputByIdSingle(page, '#busOverview_principalAddr_city', payload.Principal_Address.City);
            await this.fillInputByIdSingle(page, '#busOverview_principalAddr_zip', payload.Principal_Address.Zip_Code.toString());
            await this.fillInputByIdSingle(page, '#busOverview_businessContact_name', payload.Incorporator_Information.Incorporator_Details.keyPersonnelName);
            await this.fillInputByIdSingle(page, '#busOverview_businessContact_phone_number', payload.Incorporator_Information.Incorporator_Details.Inc_Contact_No);
            await this.clickButton(page, '#pageButton2');
            await this.clickButton(page, '#pageButton3');

            
            //principle Address
            await this.fillInputByIdSingle(page, '#jurisdiction_pplAddr_addressLine1',payload.Principal_Address.Street_Address);
            await this.fillInputByIdSingle(page, '#jurisdiction_pplAddr_addressLine2',payload.Principal_Address['Address_Line_2']  || " ");

            await this.fillInputByIdSingle(page, '#jurisdiction_pplAddr_zip', payload.Principal_Address.Zip_Code.toString());
            await this.fillInputByIdSingle(page, '#jurisdiction_pplAddr_city', payload.Principal_Address.City);
            await this.clickButton(page, '#pageButton2');
            await this.clickButton(page, '#pageButton3');

            // Duration
            await this.clickDropdown(page, '#eSelection', 'Email');
            await this.fillInputByIdSingle(page, '#contactDetail', payload.Incorporator_Information.Incorporator_Details.keyPersonnelName);
            await this.fillInputByIdSingle(page, '#contactEmail', payload.Incorporator_Information.Email_Address);
            await this.fillInputByIdSingle(page, '#validateEmail', payload.Incorporator_Information.Email_Address);
            await this.clickButton(page, '#pageButton2');
            await this.clickButton(page, '#pageButton3');

            //Registered Agent
            await this.selectRadioButtonById(page, 'registeredAgent_indvAssocNameEntityType');
            const rafullname = payload.Registered_Agent.keyPersonnelName;
            const [firstName, lastName] = await this.ra_split(rafullname);
            await this.fillInputByIdSingle(page, '#registeredAgent_individual_firstName', firstName );
            await this.fillInputByIdSingle(page, '#registeredAgent_individual_lastName',lastName );

            await page.waitForSelector('#registeredAgent_address_addressLine1', { visible: true });
            await this.fillInputByIdSingle(page, '#registeredAgent_address_addressLine1', payload.Registered_Agent.Address.Street_Address);
            await this.fillInputByIdSingle(page, '#registeredAgent_address_addressLine1', payload.Registered_Agent.Address.Street_Address);
            await this.fillInputByIdSingle(page, '#registeredAgent_address_addressLine2', payload.Registered_Agent.Address['Address_Line_2']  || " ");

            await this.fillInputByIdSingle(page, '#registeredAgent_address_zip', payload.Registered_Agent.Address.Zip_Code.toString());
            await this.fillInputByIdSingle(page, '#registeredAgent_address_city', payload.Registered_Agent.Address.City);
            await this.clickButton(page, '#pageButton2');
            await this.clickButton(page, '#pageButton3');

            //incorporator
            await this.clickButton(page, '#incorporator_multiObjectAdd');
            const orgfullname = payload.Incorporator_Information.Incorporator_Details.keyPersonnelName;
            const [orgfirstName, orglastName] = orgfullname.split(' ');
            await this.fillInputByIdSingle(page, '#incorporator_individual_firstName', orgfirstName );
            await this.fillInputByIdSingle(page, '#incorporator_individual_lastName', orglastName);
            await this.fillInputByIdSingle(page, '#incorporator_address_addressLine1', payload.Incorporator_Information.Address.Street_Address);
            await this.fillInputByIdSingle(page, '#incorporator_address_addressLine2', payload.Incorporator_Information.Address['Address_Line_2']  || " ");

            await this.fillInputByIdSingle(page, '#incorporator_address_zip',payload.Incorporator_Information.Address.Zip_Code.toString());
            await this.fillInputByIdSingle(page, '#incorporator_address_city', payload.Incorporator_Information.Address.City);
            await this.clickButton(page, '#incorporator_saveButton');
            await this.clickButton(page, '#pageButton2');
            await this.clickButton(page, '#pageButton3');

            //individual
            await this.clickButton(page, '#indDirectKnowledge_multiObjectAdd');
            await this.fillInputByIdSingle(page, '#indDirectKnowledge_individual_firstName', orgfirstName );
            await this.fillInputByIdSingle(page, '#indDirectKnowledge_individual_lastName', orglastName);
            await this.fillInputByIdSingle(page, '#indDirectKnowledge_address_addressLine1',payload.Incorporator_Information.Address.Street_Address);
            await this.fillInputByIdSingle(page, '#indDirectKnowledge_address_addressLine2',payload.Incorporator_Information.Address['Address_Line_2']  || " ");

            await this.fillInputByIdSingle(page, '#indDirectKnowledge_address_zip', payload.Incorporator_Information.Address.Zip_Code.toString());
            await this.fillInputByIdSingle(page, '#indDirectKnowledge_address_city', payload.Incorporator_Information.Address.City);
            await this.clickButton(page, '#indDirectKnowledge_saveButton');
            await this.clickButton(page, '#pageButton2');
            await this.clickButton(page, '#pageButton3');
            
            //save and continue
            await this.clickButton(page, '#pageButton2');
            await this.clickButton(page, '#pageButton3');
            
            //save and continue
            await this.clickButton(page, '#pageButton2');
            await this.clickButton(page, '#pageButton3');

            //shares
            await this.fillInputByName(page, 'brRegistrationView.shares.numberOfShares',String(payload.Stock_Details.Number_Of_Shares));
            await this.clickButton(page, '#pageButton2');
            await this.clickButton(page, '#pageButton3');
            
            //save and continue
            await this.clickButton(page, '#pageButton2');
            await this.clickButton(page, '#pageButton3');
            const res = "form filled successfully";
            return res
        } catch (error) {
            logger.error('Error in Oregon For CORP form this:', error.stack);
            throw new Error(`Oregon For CORP form submission failed: ${error.message}`);
        }
    }
}

module.exports = OregonForCORP;
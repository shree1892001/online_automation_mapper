const BaseFormHandler = require('./BaseFormHandler');
const logger = require('../utils/logger');

class FloridaForCORP extends BaseFormHandler {
    constructor() {
        super();
    }
    async FloridaForCORP(page,jsonData,payload) {
        try {
            logger.info('Navigating to Florida form submission page...');
            console.log(payload.Officer_Information)
const data = Object.values(jsonData)[0];

            const url = data.State.stateUrl;            await this.navigateToPage(page, url);
            await this.clickOnLinkByText(page, 'Start a Business');
            await this.clickOnLinkByText(page, 'Profit Articles of Incorporation');
            await this.clickButton(page, 'a.btn.btn-lg.btn-special');
            await this.selectCheckboxByLabel(page, 'Disclaimer');
            await this.clickButton(page, 'input[name="submit"][value="Start New Filing"]');
            await this.fillInputByName(page, 'corp_name', payload.Name.Legal_Name);
            await this.fillInputByName(page, 'stock_shares', String(payload.Stock_Details.Number_Of_Shares));

            await this.fillInputByName(page, 'princ_addr1', payload.Principal_Address.Street_Address)               ;
            await this.fillInputByName(page, 'princ_city', payload.Principal_Address.City);
            await this.fillInputByName(page, 'princ_st', payload.Principal_Address.State);
            await this.fillInputByName(page, 'princ_zip', String(payload.Principal_Address.Zip_Code));
            await this.fillInputByName(page, 'princ_cntry',"United States");
            /*                      MAILING ADDRESS                                 

            */

            await this.fillInputByName(page, 'mail_addr1', payload.Registered_Agent.Mailing_Information.Street_Address);
            await this.fillInputByName(page, 'mail_city', payload.Registered_Agent.Mailing_Information.City);
            await this.fillInputByName(page, 'mail_st', payload.Registered_Agent.Mailing_Information.State);
            await this.fillInputByName(page, 'mail_zip', String(payload.Registered_Agent.Mailing_Information.Zip_Code));
             
            const rafullname = payload.Registered_Agent.keyPersonnelName;
            const [firstName, lastName] = await  this.ra_split(rafullname); 
            await this.fillInputByName(page, 'ra_name_last_name', lastName);
            await this.fillInputByName(page, 'ra_name_first_name', firstName);
            await this.fillInputByName(page, 'ra_addr1',payload.Registered_Agent.Address.Street_Address);
            await this.fillInputByName(page, 'ra_city',payload.Registered_Agent.Address.City);
            await this.fillInputByName(page, 'ra_zip', String(payload.Registered_Agent.Address.Zip_Code));
            await this.fillInputByName(page, 'ra_signature',payload.Registered_Agent.keyPersonnelName);
            //incorporator information
            await this.fillInputByName(page, 'incorporator1', payload.Incorporator_Information.Incorporator_Details.keyPersonnelName);
            await this.fillInputByName(page, 'incorporator2', payload.Incorporator_Information.Address.Street_Address);
            await this.fillInputByName(page, 'incorporator4',payload.Incorporator_Information.Address.City,',' ,payload.Incorporator_Information.Address.State,',', String(payload.Incorporator_Information.Address.Zip_Code));
            await this.fillInputByName(page, 'signature', payload.Incorporator_Information.Incorporator_Details.keyPersonnelName);
            await this.fillInputbyid(page, [
                { selector: '#purpose', value: payload.Purpose.Purpose_Details }
              ]);

            // Correspondence Name And E-mail Address
            await this.fillInputByName(page, 'ret_name', payload.Incorporator_Information.Incorporator_Details.keyPersonnelName);
            await this.fillInputByName(page, 'ret_email_addr', payload.Incorporator_Information.Email_Address);
            await this.fillInputByName(page, 'email_addr_verify', payload.Incorporator_Information.Email_Address);
            //Name And Address of Person(s) Authorized to Manage LLC
            const ofcrfullName = payload.Officer_Information.Officer_Details.keyPersonnelName;
            const [ofcrfirstName, ofcrlastName] = await this.ra_split(ofcrfullName)
            
            await this.fillInputByName(page, 'off1_name_title', 'MGR');
            await this.fillInputByName(page, 'off1_name_last_name', ofcrlastName);
            await this.fillInputByName(page, 'off1_name_first_name', ofcrfirstName);
            await this.fillInputByName(page, 'off1_name_addr1', payload.Officer_Information.Address.Street_Address);
            await this.fillInputByName(page, 'off1_name_city', payload.Officer_Information.Address.City);
            await this.fillInputByName(page, 'off1_name_st',payload.Officer_Information.Address.State );
            await this.fillInputByName(page, 'off1_name_zip', String(payload.Officer_Information.Address.Zip_Code));
            await page.click('input[type="submit"][value="Continue"]');
            const res = "form filled successfully";
            return res

        } catch (error) {
            logger.error('Error in Florida For CORP form handler:', error.stack);
            throw new Error(`Florida For CORP form submission failed: ${error.message}`);
        }
    }
}

module.exports = FloridaForCORP;



const BaseFormHandler = require('./BaseFormHandler');
const logger = require('../utils/logger');

class OklahomaForLLC extends BaseFormHandler {
    constructor() {
        super();
    }
    async OklahomaForLLC(page,jsonData,payload) {
        try {
            logger.info('Navigating to New York form submission page...');
            const data = Object.values(jsonData)[0];

            const url = data.State.stateUrl;;
            await this.navigateToPage(page, url);
            await this.clickOnLinkByText(page, 'Domestic Limited Liability Company >>>>');
            await this.fillInputByName(page, 'ctl00$DefaultContent$txtName', payload.Organizer_Information.keyPersonnelName);
            await this.fillInputByName(page, 'ctl00$DefaultContent$txtUserName', payload.Organizer_Information.emailId);
            await this.clickButton(page, '#ctl00_DefaultContent_Button1');
            await this.clickButton(page, '#ctl00_DefaultContent_cmdNew');
            await this.clickButton(page, '#ctl00_DefaultContent_wiz1_bNext');
            await this.fillInputByName(page, 'ctl00$DefaultContent$wiz1$CorpNameSearch$_name', payload.Name.Legal_Name);
            await this.clickButton(page, '#ctl00_DefaultContent_wiz1_CorpNameSearch_SearchButton');
            await this.clickButton(page, '#ctl00_DefaultContent_wiz1_bNext');
            await page.waitForSelector('#ctl00_DefaultContent_wiz1_bNext');

    // Click the button
    await page.click('#ctl00_DefaultContent_wiz1_bNext');
            // await this.clickButton(page, '#ctl00_DefaultContent_wiz1_bNext');
            await this.fillInputByName(page, 'ctl00$DefaultContent$wiz1$Address$_address1', payload.Principal_Address.Street_Address);
            await this.fillInputByName(page, 'ctl00$DefaultContent$wiz1$Address$_address2', payload.Principal_Address['Address_Line_2']  || " ");

            await this.fillInputByName(page, 'ctl00$DefaultContent$wiz1$Address$_city', payload.Principal_Address.City);
            await this.fillInputByName(page, 'ctl00$DefaultContent$wiz1$Address$_zipcode', String(payload.Principal_Address.Zip_Code.toString().toString().toString().toString().toString().toString()));
            await this.fillInputByName(page, 'ctl00$DefaultContent$wiz1$Address$_email', payload.Registered_Agent.EmailId);
            await this.clickButton(page, '#ctl00_DefaultContent_wiz1_bNext');
            await new Promise(resolve => setTimeout(resolve, 5000));
            await this.clickButton(page, '#ctl00_DefaultContent_wiz1_bNext');
            const fullName = payload.Registered_Agent.keyPersonnelName;
            const [firstName, lastName] = await this.ra_split(fullName);
            await this.fillInputByName(page, 'ctl00$DefaultContent$wiz1$_firstName', firstName);
            await this.fillInputByName(page, 'ctl00$DefaultContent$wiz1$_lastName', lastName);
            await this.fillInputByName(page, 'ctl00$DefaultContent$wiz1$address1$_address1', payload.Registered_Agent.Address.Street_Address);
            await this.fillInputByName(page, 'ctl00$DefaultContent$wiz1$address1$_address2', payload.Registered_Agent.Address['Address_Line_2']  || " ");


            await this.fillInputByName(page, 'ctl00$DefaultContent$wiz1$address1$_city', payload.Registered_Agent.Address.City);
            await this.fillInputByName(page, 'ctl00$DefaultContent$wiz1$address1$_zipcode', String(payload.Registered_Agent.Address.Zip_Code.toString().toString().toString().toString().toString()));
            await this.clickButton(page, '#ctl00_DefaultContent_wiz1_bNext');
            await this.clickButton(page, '#ctl00_DefaultContent_wiz1_bNext');
            await this.clickButton(page, '#ctl00_DefaultContent_wiz1_btnAdd');
            await this.fillInputByName(page, 'ctl00$DefaultContent$wiz1$_signature', payload.Organizer_Information.keyPersonnelName);
            await this.clickButton(page, '#ctl00_DefaultContent_wiz1_btnSignature');
            await this.clickButton(page, '#ctl00_DefaultContent_wiz1_bNext');
            const res = "form filled successfully";
            return res                  
            
            
        } catch (error) {
            logger.error('Error in Oklahoma For LLC form handler:', error.stack);
            throw new Error(`Oklahoma For LLC form submission failed: ${error.message}`);
        }
    }
}

module.exports = OklahomaForLLC;



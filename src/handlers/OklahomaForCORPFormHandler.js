const BaseFormHandler = require('./BaseFormHandler');
const logger = require('../utils/logger');

class OklahomaForCORP extends BaseFormHandler {
    constructor() {
        super();
    }
    async OklahomaForCORP(page,jsonData,payload) {
        try {
            logger.info('Navigating to New York form submission page...');
            const data = Object.values(jsonData)[0];

            const url = data.State.stateUrl;;
            await this.navigateToPage(page, url);
            await this.clickOnLinkByText(page, 'Domestic For Profit Corporation >>>');
            await this.fillInputByName(page, 'ctl00$DefaultContent$txtName', payload.Incorporator_Information.Incorporator_Details.keyPersonnelName);
            await this.fillInputByName(page, 'ctl00$DefaultContent$txtUserName', payload.Incorporator_Information.Email_Address);
            await this.clickButton(page, '#ctl00_DefaultContent_Button1');
            await this.clickButton(page, '#ctl00_DefaultContent_cmdNew');
            await this.clickButton(page, '#ctl00_DefaultContent_wiz1_bNext');
            await this.fillInputByName(page, 'ctl00$DefaultContent$wiz1$CorpNameSearch$_name', payload.Name.Legal_Name);
            await this.clickButton(page, '#ctl00_DefaultContent_wiz1_CorpNameSearch_SearchButton');
            await this.clickButton(page, '#ctl00_DefaultContent_wiz1_bNext');
            await this.fillInputbyid(page, [{ selector: '#ctl00_DefaultContent_wiz1__textNotepad', value: 'Business purpose' }]);
            await this.clickButton(page, '#ctl00_DefaultContent_wiz1_bNext');
            await this.clickButton(page, '#ctl00_DefaultContent_wiz1_bNext');
            await this.clickButton(page, '#ctl00_DefaultContent_wiz1_bNext');
            const fullName = payload.Registered_Agent.keyPersonnelName;
            const [firstName, lastName] = await this.ra_split(fullName);
            await this.fillInputByName(page, 'ctl00$DefaultContent$wiz1$_firstName', firstName);
            await this.fillInputByName(page, 'ctl00$DefaultContent$wiz1$_lastName', lastName);
            await this.fillInputByName(page, 'ctl00$DefaultContent$wiz1$address1$_address1', payload.Registered_Agent.Address.Street_Address);
            await this.fillInputByName(page, 'ctl00$DefaultContent$wiz1$address1$_address2', payload.Registered_Agent.Address['Address_Line_2']  || " ");

            await this.fillInputByName(page, 'ctl00$DefaultContent$wiz1$address1$_city', payload.Registered_Agent.Address.City);
            await this.fillInputByName(page, 'ctl00$DefaultContent$wiz1$address1$_zipcode', String(payload.Registered_Agent.Address.Zip_Code.toString()));
            await this.clickButton(page, '#ctl00_DefaultContent_wiz1_bNext');
            await this.clickButton(page, '#ctl00_DefaultContent_wiz1_AddButton');
            await this.fillInputByName(page, 'ctl00$DefaultContent$wiz1$_numberOfShares', String(payload.Stock_Details.Number_Of_Shares));
            await this.clickButton(page, '#ctl00_DefaultContent_wiz1_UpdateButton');
            await this.clickButton(page, '#ctl00_DefaultContent_wiz1_bNext');
            await this.clickButton(page, '#ctl00_DefaultContent_wiz1_AddButton');
            const incfullName = payload.Incorporator_Information.Incorporator_Details.keyPersonnelName;
            const [incfirstName, inclastName] = await this.ra_split(incfullName)
            await this.fillInputByName(page, 'ctl00$DefaultContent$wiz1$_firstName',incfirstName );
            await this.fillInputByName(page, 'ctl00$DefaultContent$wiz1$_lastName',inclastName );
            await this.fillInputByName(page, 'ctl00$DefaultContent$wiz1$Address1$_address1', payload.Incorporator_Information.Address.Street_Address);
            await this.fillInputByName(page, 'ctl00$DefaultContent$wiz1$Address1$_address2', payload.Incorporator_Information.Address['Address_Line_2']  || " ");
            await this.fillInputByName(page,'ctl00$DefaultContent$wiz1$Address1$_city',payload.Incorporator_Information.Address.City);
            await this.fillInputByName(page, 'ctl00$DefaultContent$wiz1$Address1$_zipcode',(payload.Incorporator_Information.Address.Zip_Code.toString().toString()));
            await this.fillInputByName(page, 'ctl00$DefaultContent$wiz1$Address1$_email',payload.Incorporator_Information.Email_Address);
            await this.clickButton(page, '#ctl00_DefaultContent_wiz1_UpdateButton');
            await this.clickButton(page, '#ctl00_DefaultContent_wiz1_bNext');
            await this.clickButton(page, '#ctl00_DefaultContent_wiz1_AddButton');
            // 
            const dirfullName = payload.Director_Information.Director_Details.Name;
            const [dirfirstName, dirlastName] = dirfullName.split(' ');
            await this.fillInputByName(page, 'ctl00$DefaultContent$wiz1$_firstName',dirfirstName );
            await this.fillInputByName(page, 'ctl00$DefaultContent$wiz1$_lastName',dirlastName );
            await this.fillInputByName(page, 'ctl00$DefaultContent$wiz1$Address1$_address1', payload.Director_Information.Address.Dir_Address_Line_1);
            await this.fillInputByName(page, 'ctl00$DefaultContent$wiz1$Address1$_address2', payload.Director_Information.Address.Dir_Address_Line_2  || " ");
            await this.fillInputByName(page,'ctl00$DefaultContent$wiz1$Address1$_city',payload.Director_Information.Address.Dir_City);
            await this.fillInputByName(page, 'ctl00$DefaultContent$wiz1$Address1$_zipcode',String(payload.Director_Information.Address.Dir_Zip_Code.toString()));
            await this.fillInputByName(page, 'ctl00$DefaultContent$wiz1$Address1$_email',payload.Director_Information.Director_Details.Dir_Email_Address);
            await this.clickButton(page, '#ctl00_DefaultContent_wiz1_UpdateButton');
            await this.clickButton(page, '#ctl00_DefaultContent_wiz1_bNext');
            await this.clickButton(page, '#ctl00_DefaultContent_wiz1_bNext');
            await this.clickButton(page, '#ctl00_DefaultContent_wiz1_btnAdd');
            await this.fillInputByName(page, 'ctl00$DefaultContent$wiz1$_signature', payload.Incorporator_Information.Incorporator_Details.keyPersonnelName);
            await this.submitForm(page, ['#ctl00_DefaultContent_wiz1_btnSignature']);
            await this.clickButton(page, '#ctl00_DefaultContent_wiz1_bNext');
            const res = "form filled successfully";
            return res           
            
            
        } catch (error) {
            logger.error('Error in Oklahoma For CORP form handler:', error.stack);
            throw new Error(`Oklahoma For CORP form submission failed: ${error.message}`);
        }
    }
}

module.exports = OklahomaForCORP;



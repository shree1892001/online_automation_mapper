const BaseFormHandler = require('./BaseFormHandler');
const logger = require('../utils/logger');

class LouisianaForCORP extends BaseFormHandler {
    constructor() {
        super();
    }
    async LouisianaForCORP(page,jsonData,payload) {
        try {
            logger.info('Navigating to New York form submission page...');
const data = Object.values(jsonData)[0];

            const url = data.State.stateUrl;            await this.navigateToPage(page, url);
            await page.waitForSelector('a[href="/Account/SsoLogin"]');
            await page.click('a[href="/Account/SsoLogin"]');
            await this.randomSleep()
            await this.fillInputByName(page, 'ctl00$cphContent$txtEmail', data.State.filingWebsiteUsername);
            await this.fillInputByName(page, 'ctl00$cphContent$txtPassword', data.State.filingWebsitePassword);
            await this.clickButton(page, '#ctl00_cphContent_btnContinue');
            await this.clickButton(page, '.gb-get-started-button-content');
            await new Promise(resolve => setTimeout(resolve,8000))
            await page.click('input[type="radio"][name="rdMultipleSelectChoice65646"][value="71009"]');
            await new Promise(resolve => setTimeout(resolve, 8000))
            await this.clickButton(page, '#btnNext');
            await this.clickButton(page, '#div-question-control-btn-65649');
            await this.selectRadioButtonById(page, 'input-business-type-option-67878-1-4');
            await this.selectRadioButtonById(page, 'input-business-type-option-67878-3-14');
            await this.selectRadioButtonById(page, 'input-business-type-option-67878-4-16');
            await new Promise(resolve => setTimeout(resolve, 8000))
            await this.clickButton(page, '#btnNext');
            await new Promise(resolve => setTimeout(resolve, 8000))
            await page.click('input[type="checkbox"][value="73113"]');
            await page.click('input[type="radio"][name="radio-yes-no-67885"][value="false"]'); // Adjust the name as needed
            await page.click('input[type="radio"][name="radio-yes-no-67886"][value="false"]'); // Adjust the name as needed
            await this.clickButton(page, '#btnNext');
            await this.fillInputByName(page, 'input-business-name-67898', payload.Name.Legal_Name);
            await this.randomSleep()
            await this.clickButton(page, '#btnNext');
            await new Promise(resolve => setTimeout(resolve, 11000))
            await page.click('input[type="radio"][name="rdMultipleSelectChoice67907"][value="73120"]');
            await this.fillInputByName(page, 'input-number-67909', String(payload.Stock_Details.Number_Of_Shares));
            //incorporator information
            const incfullName = payload.Incorporator_Information.Incorporator_Details.keyPersonnelName;
            const [incfirstName, inclastName] = incfullName.split(' ');
            await this.fillInputByName(page, 'first-name-67910-1', incfirstName);
            await this.fillInputByName(page, 'last-name-67910-1', inclastName);
            await this.fillInputByName(page, 'address1-67910-1', payload.Incorporator_Information.Address.Street_Address);
            await this.fillInputByName(page, 'address2-67910-1', payload.Incorporator_Information.Address['Address_Line_2'] ||"");
            await this.fillInputByName(page, 'inpCity-67910-1', payload.Incorporator_Information.Address.City);
            await this.clickDropdown(page, '#ddlState-67910-1',payload.Incorporator_Information.Address.State );
            await this.fillInputByName(page, 'inpZip-67910-1', String(payload.Incorporator_Information.Address.Zip_Code));
            await this.fillInputByName(page, 'phone-67910-1', payload.Incorporator_Information.Incorporator_Details.Inc_Contact_No);
            await this.randomSleep()
            await this.clickButton(page, '#btnNext');
            await new Promise(resolve => setTimeout(resolve, 5000))
            await page.waitForSelector('input.form-control[data-input-mask="99-9999999"]', { visible: true });
            await page.type('input.form-control[data-input-mask="99-9999999"]', '12-3456789');
            await this.clickButton(page, '#btnNext');
            await new Promise(resolve => setTimeout(resolve, 5000))
            await this.fillInputByName(page, 'inpCoraZip-68012', String(payload.Principal_Address.Zip_Code));
            await this.fillInputByName(page, 'address1-68012', payload.Principal_Address.Street_Address);
            await this.fillInputByName(page, 'address2-68012', payload.Principal_Address['Address_Line_2'] ||"");
            await this.fillInputByName(page, 'visibleCity-68012', payload.Principal_Address.City);
            await this.fillInputByName(page, 'phone-68012', payload.Registered_Agent.ContactNo);
            await this.fillInputByName(page, 'email-68012', payload.Registered_Agent.EmailId);
            //add mailing address
            await this.fillInputByName(page, 'address1-68013', payload.Principal_Address.Street_Address);
            await this.fillInputByName(page, 'address2-68013', payload.Principal_Address['Address_Line_2'] ||"");
            await this.fillInputByName(page, 'inpCity-68013', payload.Principal_Address.City);
            await this.clickDropdown(page, '#ddlState-68013',payload.Principal_Address.State );  // To select 'CA' (California)
            await this.fillInputByName(page, 'inpZip-68013', String(payload.Principal_Address.Zip_Code));
            await this.fillInputByName(page, 'phone-68013', payload.Registered_Agent.ContactNo);
            //add mailing address
            await this.fillInputByName(page, 'address1-68014', payload.Registered_Agent.Mailing_Information.Street_Address);
            await this.fillInputByName(page, 'address2-68014', payload.Registered_Agent.Mailing_Information['Address_Line_2'] ||"");
            await this.fillInputByName(page, 'inpCity-68014', payload.Registered_Agent.Mailing_Information.City);
            await this.clickDropdown(page, '#ddlState-68014',payload.Registered_Agent.Mailing_Information.State);  // To select 'CA' (California)
            await this.fillInputByName(page, 'inpZip-68014', String(payload.Registered_Agent.Mailing_Information.Zip_Code));
            await this.fillInputByName(page, 'phone-68014', payload.Registered_Agent.ContactNo);
            await this.clickButton(page, '#btnNext');
            //add registered agent
            const fullName = payload.Registered_Agent.keyPersonnelName;
            const [firstName, lastName] = await this.ra_split(fullName);
            await this.fillInputByName(page, 'first-name-68021-1', firstName);
            await this.fillInputByName(page, 'last-name-68021-1', lastName);
            await this.fillInputByName(page, 'email-68021-1', payload.Registered_Agent.EmailId);
            await this.fillInputByName(page, 'verify-email-68021-1', payload.Registered_Agent.EmailId);
            await this.fillInputByName(page, 'inpCoraZip-68021-1',String( payload.Registered_Agent.Address.Zip_Code));
            await this.fillInputByName(page, 'address1-68021-1', payload.Registered_Agent.Address.Street_Address);
            await this.fillInputByName(page, 'address2-68021-1', payload.Registered_Agent.Address['Address_Line_2'] ||"");
            await this.fillInputByName(page, 'visibleCity-68021-1', payload.Registered_Agent.Address.City);
            await this.fillInputByName(page, 'phone-68021-1', payload.Registered_Agent.ContactNo);
            //add incorporator agent
            await this.fillInputByName(page, 'first-name-68023-1', incfirstName);
            await this.fillInputByName(page, 'last-name-68023-1', inclastName);
            await this.fillInputByName(page, 'ssn-68023-1', '123-45-6789');
            await this.clickDropdown(page, '#roles-68023-1','Executive Vice-President' );
            await this.fillInputByName(page, 'address1-68023-1', payload.Registered_Agent.Address.Street_Address);
            await this.fillInputByName(page, 'address2-68023-1', payload.Registered_Agent.Address['Address_Line_2']||"");
            await this.fillInputByName(page, 'inpCity-68023-1', payload.Registered_Agent.Address.City);
            await new Promise(resolve => setTimeout(resolve, 3000))
            await page.waitForSelector('#ddlState-68023-1', { visible: true});
            await page.click('#ddlState-68023-1');
            // await page.select('#ddlState-68023-1', 'LA');
            await this.clickDropdown(page, '#ddlState-68023-1', 'LA');
            await this.fillInputByName(page, 'inpZip-68023-1',String( payload.Registered_Agent.Address.Zip_Code));
            await this.fillInputByName(page, 'phone-68023-1', payload.Registered_Agent.ContactNo);
            await this.clickButton(page, '#btnNext');
            await new Promise(resolve => setTimeout(resolve, 7000))
            await page.click('input[type="radio"][name="radio-yes-no-68289"][value="false"]');
            await this.clickButton(page, '#btnNext');
            await this.fillInputByName(page, 'input-name-68294', payload.Incorporator_Information.Incorporator_Details.keyPersonnelName);
            await this.fillInputByName(page, 'input-title-68294', 'Manager');
            await this.clickButton(page, '#btnNext');
            await this.clickButton(page, '#btnNext');
            const res = "form filled successfully";
            return res

        } catch (error) {
            logger.error('Error in Louisiana For CORP form handler:', error.stack);
            throw new Error(`Louisiana For CORP form submission failed: ${error.message}`);
        }
    }
}

module.exports = LouisianaForCORP;



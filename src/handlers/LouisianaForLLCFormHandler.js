const BaseFormHandler = require('./BaseFormHandler');
const logger = require('../utils/logger');

class LouisianaForLLC extends BaseFormHandler {
    constructor() {
        super();
    }
    async LouisianaForLLC(page,jsonData,payload) {
        try {
            logger.info('Navigating to New York form submission page...');
            console.log(payload);
const data = Object.values(jsonData)[0];

            const url = data.State.stateUrl;            await this.navigateToPage(page, url);
            await page.waitForSelector('a[href="/Account/SsoLogin"]');
            await page.click('a[href="/Account/SsoLogin"]');
            await this.randomSleep()
            await this.fillInputByName(page, 'ctl00$cphContent$txtEmail', data.State.filingWebsiteUsername);
            await this.fillInputByName(page, 'ctl00$cphContent$txtPassword', data.State.filingWebsitePassword);
            await this.clickButton(page, '#ctl00_cphContent_btnContinue');
            // await this.fillInputByName(page, 'ctl00$cphContent$txtEmail', data.State.filingWebsiteUsername);
            // await this.fillInputByName(page, 'ctl00$cphContent$txtPassword', data.State.filingWebsitePassword);
            // await this.clickButton(page, '#ctl00_cphContent_btnContinue');
            await this.clickButton(page, '.gb-get-started-button-content');
            await new Promise(resolve => setTimeout(resolve, 10000))
            await page.waitForSelector('input[type="radio"][name="rdMultipleSelectChoice65646"][value="71009"]');
            await page.click('input[type="radio"][name="rdMultipleSelectChoice65646"][value="71009"]');
            await this.clickButton(page, '#btnNext');
            await new Promise(resolve => setTimeout(resolve, 5000))
            await this.clickButton(page, '#div-question-control-btn-65649');
            await new Promise(resolve => setTimeout(resolve, 5000))
            await page.waitForSelector('#input-business-type-option-67878-1-2');
            await this.selectRadioButtonById(page, 'input-business-type-option-67878-1-2');

            await page.waitForSelector('#input-business-type-option-67878-3-14');
            await this.selectRadioButtonById(page, 'input-business-type-option-67878-3-14');
            await new Promise(resolve => setTimeout(resolve, 5000))
            await this.clickButton(page, '#btnNext');
            await new Promise(resolve => setTimeout(resolve, 10000))
            await page.click('input[type="checkbox"][data-bind*="noneValue"]'); // Selects the checkbox
            await page.click('input[type="radio"][name="radio-yes-no-67885"][value="false"]'); // Adjust the name as needed
            await page.click('input[type="radio"][name="radio-yes-no-67886"][value="false"]'); // Adjust the name as needed
            await this.clickButton(page, '#btnNext');
            await this.clickDropdown(page, '#input-multi-answer-text-67894', 'Partnership');
            await this.clickButton(page, '#btnNext');
            await new Promise(resolve => setTimeout(resolve, 5000))
            await this.fillInputByName(page, 'input-business-name-67898', payload.Name.Legal_Name);
            await this.clickButton(page, '#btnNext');
            await new Promise(resolve => setTimeout(resolve, 5000)); 
            await this.randomSleep(10000,40000);
            const result = await page.evaluate(() => {
              // Find the span with the specific text
              const spanElement = Array.from(document.querySelectorAll('.submission-answer-text'))
                .find(span => span.textContent.trim() === 'Engaging in any lawful activity for which limited liability companies may be formed');
        
              if (spanElement) {
                // Find the parent label and its radio button
                const labelElement = spanElement.closest('label');
                const radioButton = labelElement?.querySelector('input[type="radio"]');
        
                if (radioButton) {
                  radioButton.click();
                  return {
                    textFound: true,
                    radioButtonClicked: true,
                    value: radioButton.value,
                    name: radioButton.name
                  };
                }
        
                return {
                  textFound: true,
                  radioButtonClicked: false
                };
              }
        
              return {
                textFound: false,
                radioButtonClicked: false
              };
            });
        
            // Log the result of the interaction
            console.log('Interaction Result:', result);
        
            // Verify the radio button state
            const isSelected = await page.evaluate(() => {
              const spanElement = Array.from(document.querySelectorAll('.submission-answer-text'))
                .find(span => span.textContent.trim() === 'Engaging in any lawful activity for which limited liability companies may be formed');
        
              if (spanElement) {
                const labelElement = spanElement.closest('label');
                const radioButton = labelElement?.querySelector('input[type="radio"]');
                return radioButton ? radioButton.checked : false;
              }
        
              return false;
            });
        
            console.log('Radio Button Selected:', isSelected);
         this.randomSleep(3000,4000);
            await this.clickButton(page, '#btnNext');
            await this.randomSleep(3000,5000);
            await this.fillInputByName(page, 'inpCoraZip-67978',String(payload.Principal_Address.Zip_Code));
            await new Promise(resolve => setTimeout(resolve, 5000))
            await this.fillInputByName(page, 'address1-67978', payload.Principal_Address.Street_Address);
            await this.fillInputByName(page, 'address2-67978', payload.Principal_Address['Address_Line_2'] ||"");
            await this.fillInputByName(page, 'visibleCity-67978', payload.Principal_Address.City);
            await this.fillInputByName(page, 'phone-67978', payload.Registered_Agent.ContactNo);
            await this.fillInputByName(page, 'email-67978', payload.Registered_Agent.EmailId);
            //add mailing address
            await this.fillInputByName(page, 'address1-67979', payload.Registered_Agent.Mailing_Information.Street_Address);
            await this.fillInputByName(page, 'address2-67979', payload.Registered_Agent.Mailing_Information['Address_Line_2'] ||"");
            await this.fillInputByName(page, 'inpCity-67979', payload.Registered_Agent.Mailing_Information.City);
            await this.clickDropdown(page, '#ddlState-67979',payload.Registered_Agent.Mailing_Information.State );  // To select 'CA' (California)
            await this.fillInputByName(page, 'inpZip-67979', String(payload.Registered_Agent.Mailing_Information.Zip_Code));
            await this.fillInputByName(page, 'phone-67979', payload.Registered_Agent.ContactNo);
            await this.clickButton(page, '#btnNext');
            //add registered agent
            const fullName = payload.Registered_Agent.keyPersonnelName;
            const [firstName, lastName] = await this.ra_split(fullName);
            await this.fillInputByName(page, 'first-name-67980-1', firstName);
            await this.fillInputByName(page, 'last-name-67980-1', lastName);
            await this.fillInputByName(page, 'email-67980-1', payload.Registered_Agent.EmailId);
            await this.fillInputByName(page, 'verify-email-67980-1', payload.Registered_Agent.EmailId);
            await this.fillInputByName(page, 'inpCoraZip-67980-1',  String(payload.Registered_Agent.Address.Zip_Code));
            await new Promise(resolve => setTimeout(resolve, 5000))
            await this.fillInputByName(page, 'address1-67980-1', payload.Registered_Agent.Address.Street_Address);
            await this.fillInputByName(page, 'address2-67980-1', payload.Registered_Agent.Address['Address_Line_2']||" ");
            await this.fillInputByName(page, 'visibleCity-67980-1', payload.Registered_Agent.Address.City);
            await this.fillInputByName(page, 'phone-67980-1', payload.Registered_Agent.ContactNo);
            await this.clickSpanByText(page, 'manager-managed');
            //add manager information 
            const orgfullName = payload.Member_Or_Manager_Details[0].Mom_Name;
            const [orgfirstName, orglastName] = orgfullName.split(' ');
            await this.fillInputByName(page, 'first-name-67983-1', orgfirstName);
            await this.fillInputByName(page, 'last-name-67983-1', orglastName);
            await this.clickDropdown(page, '#roles-67983-1', 'Manager');
            await new Promise(resolve => setTimeout(resolve, 5000))
            await this.fillInputByName(page, 'address1-67983-1', payload.Member_Or_Manager_Details[0].Address.MM_Address_Line_1);
            await this.fillInputByName(page, 'address2-67983-1', payload.Member_Or_Manager_Details[0].Address.MM_Address_Line_2 ||"");
            await this.fillInputByName(page, 'inpCity-67983-1', payload.Member_Or_Manager_Details[0].Address.MM_City);
            await this.clickDropdown(page, '#ddlState-67983-1',payload.Member_Or_Manager_Details[0].Address.MM_State );
            await this.fillInputByName(page, 'inpZip-67983-1', String(payload.Member_Or_Manager_Details[0].Address.MM_Zip_Code));
            await this.fillInputByName(page, 'phone-67983-1', payload.organizer_information.contactNo);
            await this.clickButton(page, '#btnNext');
            await page.waitForSelector('input[type="radio"][name="radio-yes-no-68289"][value="false"]', { visible: true });
            await page.click('input[type="radio"][name="radio-yes-no-68289"][value="false"]');
            await this.clickButton(page, '#btnNext');
            await this.fillInputByName(page, 'input-name-68294', payload.Member_Or_Manager_Details[0].Mom_Name);
            await this.fillInputByName(page, 'input-title-68294', 'Manager');
            await this.clickButton(page, '#btnNext');
            await this.clickButton(page, '#btnNext');
            const res = "form filled successfully";
            return res
           

        } catch (error) {
            logger.error('Error in Louisiana For LLC form handler:', error.stack);
            throw new Error(`Louisiana For LLC form submission failed: ${error.message}`);
        }
    }
}

module.exports = LouisianaForLLC;



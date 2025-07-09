const BaseFormHandler = require('./BaseFormHandler');
const logger = require('../utils/logger');
const { fetchByState } = require('../utils/getByState');
//const {selectRadioButtonByLabel,clickOnTitle,navigateToPage,addInput,clickButton  } = require('../utils/puppeteerUtils');

class MontanaForLLC extends BaseFormHandler {
    constructor() {
        super();
    }
    async MontanaForLLC(page,jsonData,payload) {
        try {
            logger.info('Navigating to New York form submission page...');
            const data = Object.values(jsonData)[0];

            const url = data.State.stateUrl;;
            await this.navigateToPage(page, url);
            await this.clickButton(page, '.btn.btn-default.login-link');
            await this.fillInputByName(page,'username',data.State.filingWebsiteUsername)
            await this.fillInputByName(page,'password',data.State.filingWebsitePassword)

            
            await this.clickButton(page, '.btn-raised.btn-light-primary.submit');
            await new Promise(resolve => setTimeout(resolve, 5000))
            await this.clickButton(page, 'a[href="/forms"]');
            await this.clickOnTitle(page, 'Articles of Organization for Domestic Limited Liability Company');
            await this.clickButton(page,'button.btn.btn-primary.btn-text')
            await this.selectRadioButtonByLabel(page,'Standard Processing - $35.00 - Up to 7 - 10 business days processing')
            await this.clickButton(page,'button.btn.btn-raised.btn-primary.next.toolbar-button')
            await this.selectRadioButtonByLabel(page,'Limited Liability Company (LLC)')
            await this.selectRadioButtonByLabel(page, 'No');
            const input_company_name = [
            { label: 'field-field1-undefined', value: payload.Name.Legal_Name },
            { label: 'field-field2-undefined', value: payload.Name.Legal_Name }
            
            ];
            await this.addInput(page, input_company_name)
            await this.selectRadioButtonByLabel(page,'The business name selected is unique across all registered businesses.  No error message is noted above.')

            //alternate legal name 
            const errorSelector = 'div.field > p.field-error';
            try {
                // Wait for the error message within the specific context
                await page.waitForSelector(errorSelector, { visible: true, timeout: 5000 });
                const errorMessage = await page.$eval(errorSelector, (el) => el.textContent.trim());
                
                if (errorMessage === "Sorry, this name is already taken. Please provide a different name to continue.") {
                    // Function to clear the input field by pressing backspace until empty
                    async function clearFieldWithBackspace(page, selector) {
                        await page.focus(selector); // Focus on the input field
                        const inputValue = await page.$eval(selector, el => el.value); // Get the current value of the field
                        for (let i = 0; i < inputValue.length; i++) {
                        await page.keyboard.press('Backspace'); // Press backspace for each character
                        }
                    }
                    await clearFieldWithBackspace(page, 'input#field-field1-undefined');
                    await page.type('input#field-field1-undefined', payload.Name.Alternate_Legal_Name); // Type the new name
                    await clearFieldWithBackspace(page, 'input#field-field2-undefined');
                    await page.type('input#field-field2-undefined', payload.Name.Alternate_Legal_Name); // Type the new name
                    await this.clickButton(page ,'.btn.btn-raised.btn-primary.next.toolbar-button')
                } else {
                    await this.clickButton(page ,'.btn.btn-raised.btn-primary.next.toolbar-button')
                }
            } catch (err) {
                await this.clickButton(page ,'.btn.btn-raised.btn-primary.next.toolbar-button')
            }
            //*********************************************/
            await new Promise(resolve => setTimeout(resolve, 5000))
            await this.selectRadioButtonByLabel(page, 'Perpetual / Ongoing');
            await this.fillInputByName(page,'ADDR1',payload.Principal_Address.Street_Address)
            await this.fillInputByName(page,'ADDR2',payload.Principal_Address['Address_Line_2']  || " ")

            await this.fillInputByName(page,'CITY',payload.Principal_Address.City)
            await this.clickDropdown(page, '#field-addr-state-B1nv2SCh7',  payload.Principal_Address.State)
            await this.fillInputByName(page,'POSTAL_CODE',String(payload.Principal_Address.Zip_Code))
           
            await this.clickButton(page ,'.btn.btn-raised.btn-primary.next.toolbar-button')
            await this.clickButton(page, '.add');
            await this.selectRadioButtonByLabel(page,'Individual')
            const fullName = payload.Registered_Agent.keyPersonnelName;
            const [firstName, lastName] = await this.ra_split(fullName);
       
            await this.fillInputByName(page,'FIRST_NAME',firstName)
            await this.fillInputByName(page,'LAST_NAME',lastName)
            await this.fillInputByName(page, 'EMAIL',  payload.Registered_Agent.EmailId)
            await this.fillInputByName(page,'ADDR1', payload.Registered_Agent.Address.Street_Address)
            await this.fillInputByName(page,'ADDR2', payload.Registered_Agent.Address['Address_Line_2']  || " ")

            await this.fillInputByName(page, 'CITY',  payload.Registered_Agent.Address.City)
            await this.fillInputByName(page,'POSTAL_CODE',String(payload.Registered_Agent.Address.Zip_Code))
            
            const inputData = [
                { selector: '#field-address1-HUiGhYlJJ_MAIL', value: payload.Registered_Agent.Mailing_Information.Street_Address },
                { selector: '#field-address2-HUiGhYlJJ_MAIL', value: payload.Registered_Agent.Mailing_Information['Address_Line_2']  || " " },
                { selector: '#field-addr-city-HUiGhYlJJ_MAIL', value: payload.Registered_Agent.Mailing_Information.City },
                { selector: '#field-addr-zip-HUiGhYlJJ_MAIL', value: payload.Registered_Agent.Mailing_Information.Zip_Code }
            ];
            await this.fillInputbyid(page, inputData);
            await page.evaluate(() => {
                const buttons = Array.from(document.querySelectorAll('button.btn.btn-raised.btn-primary'));
                const saveButton = buttons.find(button => button.textContent.trim() === 'Save');
                if (saveButton) {
                    saveButton.click();
                } else {
                    console.error('Save button not found');
                }
            });
            await new Promise(resolve => setTimeout(resolve, 3000))
            const labelForAttribute = 'field-B1HW-DPiX';  
            await page.waitForSelector(`label[for="${labelForAttribute}"]`, { visible: true, timeout: 30000 });
            await page.click(`label[for="${labelForAttribute}"]`);
            await this.clickButton(page ,'.btn.btn-raised.btn-primary.next.toolbar-button')
            await this.selectRadioButtonByLabel(page, 'Managers'); 
            await this.clickButton(page, '.btn.btn-raised.btn-primary.form-button.add-row')
            await this.selectRadioButtonByLabel(page,'Individual')
            const orgfullName = payload.Member_Or_Manager_Details[0].Mom_Name;
            const [orgfirstName, orglastName] = orgfullName.split(' ');
            const register_agent_fields = [
                { label: 'First Name*', value: orgfirstName },
                { label: 'Last Name*', value: orglastName}
                ];
            await this.addInput(page, register_agent_fields)
            const inputDataorg = [
                { selector: '#field-address1-HycDG_Dim', value: payload.Member_Or_Manager_Details[0].Address.Street_Address },
                { selector: '#field-address2-HycDG_Dim', value: payload.Member_Or_Manager_Details[0].Address.Address_Line_2  || " " },
                { selector: '#field-addr-city-HycDG_Dim', value: payload.Member_Or_Manager_Details[0].Address.City },
                { selector: '#field-addr-zip-HycDG_Dim', value: String(payload.Member_Or_Manager_Details[0].Address.Zip_Code)}
            ];
            await this.fillInputbyid(page, inputDataorg);
            await page.evaluate(() => {
                const buttons = Array.from(document.querySelectorAll('button.btn.btn-raised.btn-primary'));
                const saveButton = buttons.find(button => button.textContent.trim() === 'Save');
                if (saveButton) {
                    saveButton.click();
                } else {
                    console.error('Save button not found');
                }
            });
            await this.clickButton(page ,'.btn.btn-raised.btn-primary.next.toolbar-button')
            await this.selectRadioButtonByLabel(page, 'No');
            await this.clickButton(page ,'.btn.btn-raised.btn-primary.next.toolbar-button')
            const res = "form filled successfully";
            return res
            
        } catch (error) {
            logger.error('Error in Montana For LLC form handler:', error.stack);
            throw new Error(`Montana For LLC form submission failed: ${error.message}`);
        }
    }
}

module.exports = MontanaForLLC;



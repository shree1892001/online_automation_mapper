const BaseFormHandler = require('./BaseFormHandler');
const logger = require('../utils/logger');

class AlaskaForLLC extends BaseFormHandler {
    constructor() {
        super();
    }
    async AlaskaForLLC(page,jsonData,payload) {
        try {
            logger.info('Navigating to New York form submission page...');
                        const data = Object.values(jsonData)[0];

            const url = data.State.stateUrl;
            await this.navigateToPage(page, url);
            await this.fillInputByName(page, 'ctl00$ContentMain$TextBoxLegalName', payload.Name.Legal_Name);
            //add business purpose
            const inputData = [
                { selector: '#ContentMain_TextAreaPurpose', value: payload.Purpose.Purpose_Details}
            ];
            await this.fillInputbyid(page, inputData);
            //NAICS Code
            const optionText = payload.Naics_Code.NC_NAICS_Code
            await page.evaluate((optionText) => {
                // Get the <select> element
                const selectElement = document.querySelector('#ContentMain_DDLNAICS_DDLNAICS');
                if (selectElement) {
                  // Find the option with the given text
                  const option = Array.from(selectElement.options).find(opt => opt.text.includes(optionText));
                  if (option) {
                    selectElement.value = option.value; // Set the <select> element's value
                    const event = new Event('change', { bubbles: true }); // Trigger the change event
                    selectElement.dispatchEvent(event);
                  }
                }
              }, optionText);
            // await this.clickDropdown(page, '#ContentMain_DDLNAICS_DDLNAICS', payload.Naics_Code.NC_NAICS_Code);
            //register agent details
            const raFullName = payload.Registered_Agent.keyPersonnelName;
            const [firstName, lastName] = raFullName.split(' ');
            await this.fillInputByName(page, 'ctl00$ContentMain$TextBoxAgentFirstName', firstName);
            await this.fillInputByName(page, 'ctl00$ContentMain$TextBoxAgentLastName',lastName);
            // Mailing Address
            await this.fillInputByName(page, 'ctl00$ContentMain$AgentMailingAddress$TextBoxLine1',payload.Registered_Agent.Mailing_Information.Street_Address);
            await this.fillInputByName(page, 'ctl00$ContentMain$AgentMailingAddress$TextBoxLine2',payload.Registered_Agent.Mailing_Information['Address_Line_2']|| " ");
            await this.fillInputByName(page, 'ctl00$ContentMain$AgentMailingAddress$TextBoxCityState', payload.Registered_Agent.Mailing_Information.City);
            await this.fillInputByName(page, 'ctl00$ContentMain$AgentMailingAddress$TextBoxZip', String(payload.Registered_Agent.Mailing_Information.Zip_Code));
            await this.clickButton(page, '#ContentMain_AgentPhysicalAddress_ButtonCopy');
            //entity address
            await page.waitForSelector('input[name="ctl00$ContentMain$AgentMailingAddress$TextBoxLine1"]', {
                state: 'visible',
              });
            await this.fillInputByName(page, 'ctl00$ContentMain$EntityMailingAddress$TextBoxLine1', payload.Principal_Address.Street_Address);
            await this.fillInputByName(page, 'ctl00$ContentMain$EntityMailingAddress$TextBoxLine2', payload.Principal_Address['Address_Line_2'] || " ");
            await this.fillInputByName(page, 'ctl00$ContentMain$EntityMailingAddress$TextBoxCityState', payload.Principal_Address.City);
            await this.clickDropdown(page, '#ContentMain_EntityMailingAddress_DDLState', payload.Principal_Address.State);
            await this.fillInputByName(page, 'ctl00$ContentMain$EntityMailingAddress$TextBoxZip',String(payload.Principal_Address.Zip_Code));
            await this.clickButton(page, '#ContentMain_EntityPhysicalAddress_ButtonCopy');
            //Manager 
            await this.selectRadioButtonById(page, 'ContentMain_RBMangerManaged');
            //add organizer
            await this.clickButton(page, '#ContentMain_Organizers_ButtonAdd');
            const orgFullName = payload.Organizer_Information.keyPersonnelName;
            const [orgfirstName, orglastName] = orgFullName.split(' ');
            await this.fillInputByName(page, 'ctl00$ContentMain$TextBoxFirstName',orgfirstName);
            await this.fillInputByName(page, 'ctl00$ContentMain$TextBoxLastName', orglastName);
            await this.clickButton(page, '#ContentMain_ButtonSave');

            //signature
            await page.waitForSelector('#ContentMain_Signature_CheckBoxIPromise', { visible: true });
            await page.click('#ContentMain_Signature_CheckBoxIPromise');
            await this.fillInputByName(page, 'ctl00$ContentMain$Signature$TextBoxMyName',payload.Organizer_Information.keyPersonnelName);
            await this.fillInputByName(page, 'ctl00$ContentMain$Signature$TextBoxPhone', String(payload.organizer_information.contactNo));
            await this.clickButton(page, '#ContentMain_ButtonProceed');
            try {
                // Wait for the alert box to appear (if it exists) with a timeout
                await page.waitForSelector('.deptModalContainer', { timeout: 5000 });
            
                // If the alert box appears, click on the "Okay" button
                console.log('Alert box detected, clicking "Okay"...');
                await page.click('.deptModalActions .deptButton.iconBefore.icoYesBefore');
                const errorMessage = await page.evaluate(() => {
                    const errorElement = document.querySelector('.errors');
                    return errorElement ? errorElement.textContent.trim() : null;
                  });
              
                  if (errorMessage === "Name is not available.") {
                    console.log('Error detected: "Name is not available."');
                    //alternate legal name 
                    const inputSelector = '#ContentMain_TextBoxLegalName';
                    await page.focus(inputSelector);

                    // Move cursor to the start of the field and press Delete repeatedly
                    const inputValue = await page.$eval(inputSelector, el => el.value); // Get current value
                    for (let i = 0; i < inputValue.length; i++) {
                        await page.keyboard.press('Delete'); // Press Delete to clear each character
                    }
                    await page.type('#ContentMain_TextBoxLegalName', payload.Name.Alternate_Legal_Name);
                    await this.clickButton(page, '#ContentMain_ButtonProceed');
                  }
              } catch (error) {
                // If the alert box doesn't appear, continue without any action
                console.log('No alert box detected.');
              }
            const res = "form filled successfully";
            return res
        } catch (error) {
            logger.error('Error in Alaska For LLC form handler:', error.stack);
            throw new Error(`Alaska For LLC form submission failed: ${error.message}`);
        }
    }
}

module.exports = AlaskaForLLC;



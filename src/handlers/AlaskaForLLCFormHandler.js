const BaseFormHandler = require('./BaseFormHandler');
const logger = require('../utils/logger');
const { fetchByState } = require('../utils/getByState');

class AlaskaForLLC extends BaseFormHandler {
    constructor() {
        super();
    }
    async AlaskaForLLC(page,jsonData,payload) {
        try {
            logger.info('Navigating to Alaska LLC form submission page...');
            const data = Object.values(jsonData)[0];
            const stateMapping = await fetchByState(data.State.id);
            
            for(let i=0;i< stateMapping.length;i++){

              console.log(i,stateMapping[i].online_field_mapping,stateMapping[i].json_key);
                }

            // Helper function to safely get value from payload
            const getSafeValue = async (payload, jsonKey, defaultValue = "") => {
                const value = await this.getValueFromPayload(payload, jsonKey);
                return value !== null && value !== undefined ? String(value) : defaultValue;
            };

            await this.navigateToPage(page, data.State.stateUrl);
            
            // Legal Name
            await this.fillInputByName(page, stateMapping[28].online_field_mapping, await getSafeValue(payload, stateMapping[28].json_key));
            
            // Business Purpose (use mapping index 64)
            await this.fillInputbyid(page, [{ selector: stateMapping[64].online_field_mapping, value: await getSafeValue(payload, stateMapping[64].json_key) }]);
            
            // NAICS Code (use mapping index 50)
            const optionText = await getSafeValue(payload, stateMapping[50].json_key);
            await page.evaluate((optionText) => {
                const selectElement = document.querySelector('#ContentMain_DDLNAICS_DDLNAICS');
                if (selectElement) {
                  const option = Array.from(selectElement.options).find(opt => opt.text.includes(optionText));
                  if (option) {
                        selectElement.value = option.value;
                        const event = new Event('change', { bubbles: true });
                    selectElement.dispatchEvent(event);
                  }
                }
              }, optionText);
            
            // Registered Agent Name (split logic)
            const raFullName = await getSafeValue(payload, 'payload.Registered_Agent.keyPersonnelName');
            const [firstName, lastName] = raFullName.split(' ');
            await this.fillInputByName(page, stateMapping[65].online_field_mapping, firstName);
            await this.fillInputByName(page, stateMapping[66].online_field_mapping, lastName);
            
            // Agent Mailing Address
            await this.fillInputByName(page, stateMapping[67].online_field_mapping, await getSafeValue(payload, stateMapping[67].json_key));
            await this.fillInputByName(page, stateMapping[68].online_field_mapping, await getSafeValue(payload, stateMapping[68].json_key) || " ");
            await this.fillInputByName(page, stateMapping[69].online_field_mapping, await getSafeValue(payload, stateMapping[69].json_key));
            await this.fillInputByName(page, stateMapping[70].online_field_mapping, await getSafeValue(payload, stateMapping[70].json_key));
            
            // Copy Agent Physical Address
            await this.clickButton(page, stateMapping[1].online_field_mapping);
            
            // Entity Mailing Address
            await page.waitForSelector('input[name="ctl00$ContentMain$AgentMailingAddress$TextBoxLine1"]', { state: 'visible' });
            await this.fillInputByName(page, stateMapping[71].online_field_mapping, await getSafeValue(payload, stateMapping[71].json_key));
            await this.fillInputByName(page, stateMapping[72].online_field_mapping, await getSafeValue(payload, stateMapping[72].json_key) || " ");
            await this.fillInputByName(page, stateMapping[73].online_field_mapping, await getSafeValue(payload, stateMapping[73].json_key));
            await this.randomSleep(1000,4000);
            await this.clickDropdown(page, stateMapping[80].online_field_mapping, await getSafeValue(payload, stateMapping[80].json_key));
            await this.fillInputByName(page, stateMapping[74].online_field_mapping, await getSafeValue(payload, stateMapping[74].json_key));
            
            // Copy Entity Physical Address
            await this.clickButton(page, stateMapping[2].online_field_mapping);
            
            // Manager (use mapping index 11)
            await this.selectRadioButtonById(page, stateMapping[11].online_field_mapping);
            
            // Add Organizer (use mapping index 12)
            await this.clickButton(page, stateMapping[12].online_field_mapping);
            
            // Organizer Name (split logic)
            const orgFullName = await getSafeValue(payload, 'payload.Organizer_Information.keyPersonnelName');
            const [orgfirstName, orglastName] = orgFullName.split(' ');
            await this.fillInputByName(page, stateMapping[75].online_field_mapping, orgfirstName);
            await this.fillInputByName(page, stateMapping[76].online_field_mapping, orglastName);
            
            // Save button (use mapping index 13)
            await this.clickButton(page, stateMapping[13].online_field_mapping);

            // Signature (use mapping index 14)
            await page.waitForSelector(stateMapping[14].online_field_mapping, { visible: true });
            await page.click(stateMapping[14].online_field_mapping);
            await this.fillInputByName(page, stateMapping[77].online_field_mapping, await getSafeValue(payload, stateMapping[77].json_key));
            await this.fillInputByName(page, stateMapping[78].online_field_mapping, await getSafeValue(payload, stateMapping[78].json_key));
            
            // Proceed button (use mapping index 15)
            await this.clickButton(page, stateMapping[15].online_field_mapping);
            
            // Handle name availability check
            try {
                await page.waitForSelector('.deptModalContainer', { timeout: 5000 });
                console.log('Alert box detected, clicking "Okay"...');
                // Modal actions (use mapping index 16)
                await page.click(stateMapping[16].online_field_mapping);
                
                const errorMessage = await page.evaluate(() => {
                    const errorElement = document.querySelector('.errors');
                    return errorElement ? errorElement.textContent.trim() : null;
                  });
              
                  if (errorMessage === "Name is not available.") {
                    console.log('Error detected: "Name is not available."');
                    // Alternate legal name
                    const inputSelector = stateMapping[63].online_field_mapping;
                    await page.focus(inputSelector);

                    // Clear the field
                    const inputValue = await page.$eval(inputSelector, el => el.value);
                    for (let i = 0; i < inputValue.length; i++) {
                        await page.keyboard.press('Delete');
                    }
                    
                    await page.type(stateMapping[63].online_field_mapping, await getSafeValue(payload, stateMapping[63].json_key));
                    // Proceed button (use mapping index 15)
                    await this.clickButton(page, stateMapping[15].online_field_mapping);
                  }
              } catch (error) {
                console.log('No alert box detected.');
              }
            
            return "form filled successfully";
        } catch (error) {
            logger.error('Error in Alaska For LLC form handler:', error.stack);
            throw new Error(`Alaska For LLC form submission failed: ${error.message}`);
        }
    }
}

module.exports = AlaskaForLLC;


